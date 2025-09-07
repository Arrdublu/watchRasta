
'use server';

import admin from 'firebase-admin';

function initializeAdminApp() {
    if (admin.apps.length === 0) {
        try {
            console.log("Initializing Firebase Admin SDK...");
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            console.log("Firebase Admin SDK initialized successfully.");
        } catch (e: any) {
            console.error('Firebase Admin SDK initialization error:', e.stack);
            throw new Error(`Failed to initialize Firebase Admin SDK: ${e.message}`);
        }
    }
    return admin.app();
}

// Keep async signature to avoid breaking calling code.
export async function getDb() {
    initializeAdminApp();
    return admin.firestore();
}

export async function getAuth() {
    initializeAdminApp();
    return admin.auth();
}

export async function getStorage() {
    initializeAdminApp();
    return admin.storage();
}
