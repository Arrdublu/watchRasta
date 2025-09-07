
'use server';

import admin from 'firebase-admin';
import { getDb } from '@/lib/firebase-admin';

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
    const db = await getDb();
    if (!db) {
        return null;
    }
    return db.collection('comments');
};

// CREATE
export async function addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
  const newComment = {
    ...comment,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const commentsCollection = await getCommentsCollection();
  if (!commentsCollection) throw new Error("Database not available");
  const docRef = await commentsCollection.add(newComment);
  return { ...newComment, id: docRef.id };
}

// READ (by articleId)
export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  const commentsCollection = await getCommentsCollection();
  if (!commentsCollection) return [];

  const q = commentsCollection
    .where('articleId', '==', articleId)
    .orderBy('createdAt', 'asc');

  const snapshot = await q.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    } as Comment;
  });
}
