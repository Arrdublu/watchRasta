
'use server';
import admin from 'firebase-admin';
import { getDb, getStorage } from '@/lib/firebase-admin';
import type { ArticleCategory } from '@/lib/article-categories';


export type Article = {
  id: string; // Firestore document ID
  slug: string;
  title: string;
  category: ArticleCategory;
  image: string;
  opengraphImage: string;
  dataAiHint: string;
  excerpt: string;
  content: string;
  author: string; // user's email
  authorId: string; // user's UID
  date: string; // Keep as ISO string for consistency
  createdAt: string; // Firestore server timestamp
  updatedAt?: string | null;
  status: 'Published' | 'Draft' | 'Pending Review' | 'Rejected';
};

// Helper to convert Firestore timestamp to a serializable date string
const toSerializableDate = (timestamp: any): string => {
    if (timestamp?.toDate) {
        return timestamp.toDate().toISOString();
    }
    return new Date().toISOString();
};

// Helper to convert a Firestore document to a serializable Article object
const fromDocToArticle = (doc: admin.firestore.DocumentSnapshot): Article => {
    const data = doc.data()!;
    const createdAt = toSerializableDate(data.createdAt);
    const updatedAt = data.updatedAt ? toSerializableDate(data.updatedAt) : null;

    return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        image: data.image,
        opengraphImage: data.opengraphImage,
        dataAiHint: data.dataAiHint,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        authorId: data.authorId,
        date: createdAt, // Using createdAt for the main 'date' field
        createdAt: createdAt,
        updatedAt: updatedAt,
        status: data.status,
    };
}


const getArticlesCollection = async () => {
    const db = await getDb();
    if (!db) {
        return null;
    }
    return db.collection('articles');
};


// CREATE
export async function addArticle(article: Omit<Article, 'id' | 'slug' | 'date' | 'opengraphImage' | 'createdAt' | 'updatedAt'> & {image: string}) {
  const newArticle = {
    ...article,
    slug: article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    date: new Date().toISOString(),
    opengraphImage: article.image.replace('600/400', '1200/630'),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const articlesCollection = await getArticlesCollection();
  if (!articlesCollection) throw new Error("Database not available");
  const docRef = await articlesCollection.add(newArticle);
  return await getArticleById(docRef.id);
}

// READ (all)
export async function getArticles(options: { category?: ArticleCategory, limit?: number, authorId?: string } = {}) {
    const articlesCollection = await getArticlesCollection();
    if (!articlesCollection) return [];

    let q: admin.firestore.Query = articlesCollection.orderBy('createdAt', 'desc');

    if (options.category) {
        q = q.where('category', '==', options.category);
    }
    
    if (options.limit) {
        q = q.limit(options.limit);
    }

    if (options.authorId) {
        q = q.where('authorId', '==', options.authorId);
    }

    const snapshot = await q.get();
    return snapshot.docs.map(fromDocToArticle);
}


// READ (by slug)
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articlesCollection = await getArticlesCollection();
  if (!articlesCollection) return null;

  const q = articlesCollection.where('slug', '==', slug);
  const snapshot = await q.get();
  if (snapshot.empty) {
    return null;
  }
  const docRef = snapshot.docs[0];
  const article = fromDocToArticle(docRef);


  if (article.content && article.content.startsWith('https://firebasestorage.googleapis.com')) {
    try {
        const storage = await getStorage();
        const bucket = storage.bucket();
        // Extract the file path from the URL
        const filePath = decodeURIComponent(article.content.split('/o/')[1].split('?')[0]);
        const file = bucket.file(filePath);
        const [fileContent] = await file.download();
        article.content = fileContent.toString('utf8');
    } catch (error) {
        console.error("Error downloading article content from storage:", error);
        article.content = "<p>Error: Could not load article content.</p>";
    }
  }

  return article;
}

// READ (by ID)
export async function getArticleById(id: string): Promise<Article | null> {
    const db = await getDb();
    if (!db) return null;

    const docRef = db.collection('articles').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        const article = fromDocToArticle(docSnap);
        if (article.content && article.content.startsWith('https://firebasestorage.googleapis.com')) {
            try {
                const storage = await getStorage();
                const bucket = storage.bucket();
                const filePath = decodeURIComponent(article.content.split('/o/')[1].split('?')[0]);
                const file = bucket.file(filePath);
                const [fileContent] = await file.download();
                article.content = fileContent.toString('utf8');
            } catch (error) {
                console.error("Error downloading article content for edit:", error);
                article.content = "Error loading content. Please try saving again.";
            }
        }
        return article;
    }
    
    return null;
}


// UPDATE
export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt' | 'slug' | 'date' | 'author' | 'authorId'>>) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const docRef = db.collection('articles').doc(id);
    await docRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return await getArticleById(id);
}

// UPDATE STATUS
export async function updateArticleStatus(id: string, status: Article['status']) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('articles').doc(id);
    await docRef.update({ status });
}

// DELETE
export async function deleteArticle(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('articles').doc(id);
        await docRef.delete();
        return { success: true };
    } catch(error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete article: ${message}` };
    }
}
