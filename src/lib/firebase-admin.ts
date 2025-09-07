
'use server';

import admin from 'firebase-admin';

const initializeFirebaseAdmin = () => {
    if (process.env.BUILDING) {
        return;
    }

    if (!admin.apps.length) {
        try {
            if (!process.env.SERVICE_ACCOUNT) {
                throw new Error('SERVICE_ACCOUNT environment variable is not set.');
            }
            const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (e) {
            console.error('Failed to parse SERVICE_ACCOUNT or initialize firebase-admin', e);
        }
    }
};

export async function getDb() {
    initializeFirebaseAdmin();
    if (process.env.BUILDING) {
        // Return a mock/dummy object during build to avoid errors
        return null as unknown as admin.firestore.Firestore;
    }
    return admin.firestore();
}

export async function getStorage() {
    initializeFirebaseAdmin();
    if (process.env.BUILDING) {
        return null as unknown as admin.storage.Storage;
    }
    return admin.storage();
}

export async function getAuth() {
    initializeFirebaseAdmin();
     if (process.env.BUILDING) {
        return null as unknown as admin.auth.Auth;
    }
    return admin.auth();
}
