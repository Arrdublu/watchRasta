'use server';

import admin from 'firebase-admin';

if (admin.apps.length === 0) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (e: any) {
        console.error('Firebase Admin SDK initialization error:', e.stack);
    }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();


export async function getDb() {
    return db;
}

export async function getAuth() {
    return auth;
}

export async function getStorage() {
    return storage;
}
