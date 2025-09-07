
import { db } from '@/lib/firebase-admin';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, limit, writeBatch } from 'firebase/firestore';

export type ArticleCategory = 'News' | 'Lifestyle' | 'Brands' | 'Album Reviews' | 'Interviews' | 'Tour Diaries' | 'Gear';

export const articleCategories: [ArticleCategory, ...ArticleCategory[]] = [
  'News',
  'Lifestyle',
  'Brands',
  'Album Reviews',
  'Interviews',
  'Tour Diaries',
  'Gear',
];

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
  createdAt: any; // Firestore server timestamp
  status: 'Published' | 'Draft' | 'Pending Review' | 'Rejected';
};

const articlesCollection = collection(db, 'articles');

// CREATE
export async function addArticle(article: Omit<Article, 'id' | 'slug' | 'date' | 'opengraphImage' | 'createdAt'> & {image: string}) {
  const newArticle = {
    ...article,
    slug: article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    date: new Date().toISOString(),
    opengraphImage: article.image.replace('600/400', '1200/630'),
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(articlesCollection, newArticle);
  return { ...newArticle, id: docRef.id };
}

// READ (all)
export async function getArticles(options: { category?: ArticleCategory, limit?: number, authorId?: string } = {}) {
    let q = query(articlesCollection, orderBy('createdAt', 'desc'));

    if (options.category) {
        q = query(q, where('category', '==', options.category));
    }
    
    if (options.limit) {
        q = query(q, limit(options.limit));
    }

    if (options.authorId) {
        q = query(q, where('authorId', '==', options.authorId));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
        return {
            ...data,
            id: doc.id,
            date: createdAt,
            createdAt: createdAt,
        } as Article;
    });
}


// READ (by slug)
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(articlesCollection, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const docRef = snapshot.docs[0];
  const data = docRef.data();
  const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
  return {
      ...data,
      id: docRef.id,
      date: createdAt,
      createdAt: createdAt,
  } as Article;
}

// READ (by ID) - useful for admin/user updates
export async function getArticleById(id: string): Promise<Article | null> {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
        return {
            ...data,
            id: docSnap.id,
            date: createdAt,
            createdAt: createdAt,
        } as Article;
    } else {
        return null;
    }
}


// UPDATE
export async function updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'createdAt' | 'slug' | 'date' | 'author' | 'authorId'>>) {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

// UPDATE STATUS
export async function updateArticleStatus(id: string, status: Article['status']) {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, { status });
}

// DELETE
export async function deleteArticle(id: string) {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
}

    