
'use server';
import admin from 'firebase-admin';
import { getDb } from '@/lib/firebase-admin';
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
  status: 'Published' | 'Draft' | 'Pending Review' | 'Rejected';
};

const getArticlesCollection = async () => {
    const db = await getDb();
    if (!db) {
        return null;
    }
    return db.collection('articles');
};


// CREATE
export async function addArticle(article: Omit<Article, 'id' | 'slug' | 'date' | 'opengraphImage' | 'createdAt'> & {image: string}) {
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
  return { ...newArticle, id: docRef.id };
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
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
        const updatedAt = data.updatedAt?.toDate ? new Date(data.updatedAt.toDate()).toISOString() : null;
        return {
            ...data,
            id: doc.id,
            date: createdAt,
            createdAt: createdAt,
            updatedAt: updatedAt,
        } as unknown as Article;
    });
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
  const data = docRef.data();
  const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
  const updatedAt = data.updatedAt?.toDate ? new Date(data.updatedAt.toDate()).toISOString() : null;

  return {
      ...data,
      id: docRef.id,
      date: createdAt,
      createdAt: createdAt,
      updatedAt: updatedAt,
  } as unknown as Article;
}

// READ (by ID)
export async function getArticleById(id: string): Promise<Article | null> {
    const db = await getDb();
    if (!db) return null;

    const docRef = db.collection('articles').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        const data = docSnap.data();
        if (data) {
            const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
            const updatedAt = data.updatedAt?.toDate ? new Date(data.updatedAt.toDate()).toISOString() : null;
            return {
                ...data,
                id: docSnap.id,
                date: createdAt,
                createdAt: createdAt,
                updatedAt: updatedAt,
            } as unknown as Article;
        }
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
}

// UPDATE STATUS
export async function updateArticleStatus(id: string, status: Article['status']) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('articles').doc(id);
    await docRef.update({ status });
}

// DELETE
export async function deleteArticle(id: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('articles').doc(id);
    await docRef.delete();
}
