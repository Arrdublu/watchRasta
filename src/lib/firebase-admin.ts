
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

initializeFirebaseAdmin();

export async function getDb() {
    if (process.env.BUILDING) {
        // Return a mock/dummy object during build to avoid errors
        return null;
    }
    if (!admin.apps.length) {
        initializeFirebaseAdmin();
    }
    return admin.firestore();
}

export async function getStorage() {
    if (process.env.BUILDING) {
        return null;
    }
     if (!admin.apps.length) {
        initializeFirebaseAdmin();
    }
    return admin.storage();
}

export async function getAuth() {
     if (process.env.BUILDING) {
        return null;
    }
     if (!admin.apps.length) {
        initializeFirebaseAdmin();
    }
    return admin.auth();
}
