'use server';
import admin from 'firebase-admin';

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (e: any) {
        console.error('Firebase Admin SDK initialization error:', e.stack);
        throw new Error('Failed to initialize Firebase Admin SDK. Please check server logs for details.');
    }
}

export async function getDb() {
    initializeFirebaseAdmin();
    return admin.firestore();
}

export async function getAuth() {
    initializeFirebaseAdmin();
    return admin.auth();
}

export async function getStorage() {
    initializeFirebaseAdmin();
    return admin.storage();
}
