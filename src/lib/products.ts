
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming you have a firebase initialization file

export type Product = {
  id: string; // Changed to string to accommodate Firestore document IDs
  collectionId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  dataAiHint: string;
  status: 'Published' | 'Draft' | 'Pending Review';
  authorEmail: string;
};

// The in-memory array is removed. Data will now be fetched from Firestore.

export async function addProduct(product: Omit<Product, 'id'>) {
  const docRef = await addDoc(collection(db, 'products'), product);
  return { ...product, id: docRef.id };
}

export async function getProductsByCollectionId(collectionId: number): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('collectionId', '==', collectionId), where('status', '==', 'Published'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
        return undefined;
    }
}
