
'use server';

import { db } from '@/lib/firebase';
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

const commentsCollection = collection(db, 'comments');

// CREATE
export async function addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
  const newComment = {
    ...comment,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(commentsCollection, newComment);
  return { ...newComment, id: docRef.id };
}

// READ (by articleId)
export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
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
