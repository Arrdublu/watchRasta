'use server';

import admin from 'firebase-admin';
import { getDb } from './firebase-admin';

export type Collection = {
  id: string; // Firestore document ID
  numericId: number; // The original numeric ID for linking
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  href: string;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
};


// Helper to convert Firestore timestamp to a serializable date string
const toSerializableDate = (timestamp: any): string => {
    if (timestamp?.toDate) {
        return timestamp.toDate().toISOString();
    }
    return new Date().toISOString();
};

// Helper to convert a Firestore document to a serializable Collection object
const fromDocToCollection = (doc: admin.firestore.DocumentSnapshot): Collection => {
    const data = doc.data()!;
    const createdAt = toSerializableDate(data.createdAt);

    return {
        id: doc.id,
        numericId: data.numericId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        dataAiHint: data.dataAiHint,
        href: data.href,
        status: data.status,
        createdAt: createdAt,
    };
}


const getCollectionsCollection = async () => {
    const db = await getDb();
    if (!db) {
        return null;
    }
    return db.collection('collections');
};

// Get all collections, ordered by creation date
export async function getCollections(options: { status?: Collection['status'] } = {}): Promise<Collection[]> {
  const collectionsCollection = await getCollectionsCollection();
  if (!collectionsCollection) return [];
  
  let q: admin.firestore.Query = collectionsCollection.orderBy('numericId', 'asc');

  if (options.status) {
    q = q.where('status', '==', options.status);
  }

  const snapshot = await q.get();
  return snapshot.docs.map(fromDocToCollection);
}

// Get a single collection by its original numeric ID
export async function getCollectionByNumericId(numericId: number): Promise<Collection | null> {
  const collectionsCollection = await getCollectionsCollection();
  if (!collectionsCollection) return null;

  const q = collectionsCollection.where('numericId', '==', numericId);
  const snapshot = await q.get();
  if (snapshot.empty) {
    return null;
  }
  const docRef = snapshot.docs[0];
  return fromDocToCollection(docRef);
}
