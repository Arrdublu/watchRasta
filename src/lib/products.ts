
'use server';

import admin from 'firebase-admin';
import { getDb } from '@/lib/firebase-admin';

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
  createdAt: string; 
  updatedAt?: string | null;
};

const getProductsCollection = async () => {
    const db = await getDb();
    if (!db) {
        return null;
    }
    return db.collection('products');
};

// CREATE
export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
  const newProduct = {
    ...product,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const productsCollection = await getProductsCollection();
  if (!productsCollection) throw new Error("Database not available");
  const docRef = await productsCollection.add(newProduct);
  return { ...newProduct, id: docRef.id };
}

// READ (by collection ID)
export async function getProductsByCollectionId(collectionId: number): Promise<Product[]> {
  const productsCollection = await getProductsCollection();
  if (!productsCollection) return [];

  const q = productsCollection
    .where('collectionId', '==', collectionId)
    .where('status', '==', 'Published');

  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

// READ (by author ID)
export async function getProductsByAuthorId(authorId: string): Promise<Product[]> {
    const productsCollection = await getProductsCollection();
    if (!productsCollection) return [];

    const q = productsCollection
        .where('authorId', '==', authorId)
        .orderBy('createdAt', 'desc');
        
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
        const updatedAt = data.updatedAt?.toDate ? new Date(data.updatedAt.toDate()).toISOString() : null;
        return { 
            ...data,
            id: doc.id,
            createdAt: createdAt,
            updatedAt: updatedAt,
        } as Product;
    });
}


// READ (by ID)
export async function getProductById(id: string): Promise<Product | undefined> {
    const db = await getDb();
    if (!db) return undefined;

    const docRef = db.collection('products').doc(id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return { ...docSnap.data(), id: docSnap.id } as Product;
    }
    return undefined;
}

// READ (all)
export async function getAllProducts(options: { authorId?: string } = {}): Promise<Product[]> {
  const productsCollection = await getProductsCollection();
  if (!productsCollection) return [];

  let q: admin.firestore.Query = productsCollection.orderBy('createdAt', 'desc');

  if (options.authorId) {
      q = q.where('authorId', '==', options.authorId);
  }

  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString();
    const updatedAt = data.updatedAt?.toDate ? new Date(data.updatedAt.toDate()).toISOString() : null;
    return {
      ...data,
      id: doc.id,
      createdAt: createdAt,
      updatedAt: updatedAt,
    } as Product;
  });
}

// UPDATE
export async function updateProduct(id: string, updates: Partial<Product>) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('products').doc(id);
    await docRef.update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}

// UPDATE STATUS
export async function updateProductStatus(id: string, status: Product['status']) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('products').doc(id);
    await docRef.update({ status });
}

// DELETE
export async function deleteProduct(id: string) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const docRef = db.collection('products').doc(id);
    await docRef.delete();
}
