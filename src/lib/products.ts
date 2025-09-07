

import { collection, getDocs, query, where, addDoc, doc, getDoc, deleteDoc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-admin';

export type Product = {
  id: string;
  collectionId: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  dataAiHint: string;
  status: 'Published' | 'Draft' | 'Pending Review';
  author: string;
  authorId: string;
  createdAt: any; 
};

const productsCollection = collection(db, 'products');

// CREATE
export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
  const newProduct = {
    ...product,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(productsCollection, newProduct);
  return { ...newProduct, id: docRef.id };
}

// READ (by collection ID)
export async function getProductsByCollectionId(collectionId: number): Promise<Product[]> {
  const q = query(
    productsCollection, 
    where('collectionId', '==', collectionId), 
    where('status', '==', 'Published')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

// READ (by author ID)
export async function getProductsByAuthorId(authorId: string): Promise<Product[]> {
    const q = query(
        productsCollection,
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}


// READ (by ID)
export async function getProductById(id: string): Promise<Product | undefined> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Product;
    }
    return undefined;
}

// READ (all)
export async function getAllProducts(options: { authorId?: string } = {}): Promise<Product[]> {
  let q = query(productsCollection, orderBy('createdAt', 'desc'));

  if (options.authorId) {
      q = query(q, where('authorId', '==', options.authorId));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

// UPDATE
export async function updateProduct(id: string, updates: Partial<Product>) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

// UPDATE STATUS
export async function updateProductStatus(id: string, status: Product['status']) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { status });
}

// DELETE
export async function deleteProduct(id: string) {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
}
