
'use server';

import { getDb } from '@/lib/firebase-admin';
import type { Collection } from '@/lib/collections';

// UPDATE STATUS
export async function updateCollectionStatus(id: string, status: Collection['status']) {
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('collections').doc(id);
        await docRef.update({ status });
        return { success: true };
    } catch(error) {
        return { success: false, message: 'Failed to update collection status.' };
    }
}

// DELETE
export async function deleteCollection(id: string) {
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('collections').doc(id);
        await docRef.delete();
        return { success: true };
    } catch(error) {
        return { success: false, message: 'Failed to delete collection.' };
    }
}
