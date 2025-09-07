
'use server';

import { getDb } from '@/lib/firebase-admin';
import type { Product } from '@/lib/products';

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
