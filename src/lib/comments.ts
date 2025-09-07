
'use server';

import { getDb } from '@/lib/firebase-admin';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';


export type Comment = {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
};

const getCommentsCollection = async () => {
    // During build, env vars are not available, so we can't connect to DB.
    if (!process.env.SERVICE_ACCOUNT) {
        return null;
    }
    const db = await getDb();
    if (!db) return null;
    return collection(db, 'comments');
};

// CREATE
export async function addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
  const newComment = {
    ...comment,
    createdAt: serverTimestamp(),
  };
  const commentsCollection = await getCommentsCollection();
  if (!commentsCollection) throw new Error("Database not available");
  const docRef = await addDoc(commentsCollection, newComment);
  return { ...newComment, id: docRef.id };
}

// READ (by articleId)
export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  const commentsCollection = await getCommentsCollection();
  if (!commentsCollection) return [];

  const q = query(
    commentsCollection,
    where('articleId', '==', articleId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    } as Comment;
  });
}
