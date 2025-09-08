
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
export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('products').doc(id);
        await docRef.delete();
        return { success: true };
    } catch(error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete product: ${message}` };
    }
}
