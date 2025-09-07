
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export type Collection = {
  id: string; // Firestore document ID
  numericId: number; // The original numeric ID for linking
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  href: string;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: any;
};

const collectionsCollection = collection(db, 'collections');

// Get all collections, ordered by creation date
export async function getCollections(options: { status?: Collection['status'] } = {}): Promise<Collection[]> {
  let q = query(collectionsCollection, orderBy('numericId', 'asc'));

  if (options.status) {
    q = query(q, where('status', '==', options.status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data() as Omit<Collection, 'id'>, id: doc.id }));
}

// Get a single collection by its original numeric ID
export async function getCollectionByNumericId(numericId: number): Promise<Collection | null> {
  const q = query(collectionsCollection, where('numericId', '==', numericId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  return { ...doc.data() as Omit<Collection, 'id'>, id: doc.id };
}

// Get a single collection by its Firestore ID
export async function getCollectionById(id: string): Promise<Collection | null> {
  const docRef = doc(db, 'collections', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data() as Omit<Collection, 'id'>, id: docSnap.id };
  }
  return null;
}
