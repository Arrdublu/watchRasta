
'use server';

import { getDb } from '@/lib/firebase-admin';
import type { Collection } from '@/lib/collections';

// UPDATE STATUS
export async function updateCollectionStatus(id: string, status: Collection['status']): Promise<{ success: boolean; message?: string }> {
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('collections').doc(id);
        await docRef.update({ status });
        return { success: true, message: `Collection status updated to ${status}.` };
    } catch(error) {
        console.error("Failed to update collection status:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update collection status: ${message}` };
    }
}

// DELETE
export async function deleteCollection(id: string): Promise<{ success: boolean; message?: string }>{
    try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const docRef = db.collection('collections').doc(id);
        await docRef.delete();
        return { success: true, message: 'Collection deleted successfully.' };
    } catch(error) {
        console.error("Failed to delete collection:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete collection: ${message}` };
    }
}
