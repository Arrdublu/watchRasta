
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
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
    return { 
      ...data,
      id: doc.id,
      createdAt,
    } as Collection;
  });
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
  const data = docRef.data();
  const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
  return { 
    ...data as Omit<Collection, 'id'>, 
    id: docRef.id,
    createdAt,
  };
}
