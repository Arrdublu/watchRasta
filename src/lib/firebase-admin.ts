'use server';

import admin from 'firebase-admin';

const initializeFirebaseAdmin = () => {
    if (admin.apps.length > 0) {
        return;
    }

    // Only attempt to initialize if the service account is available.
    // This will be true at runtime, but false during the build process.
    if (process.env.SERVICE_ACCOUNT) {
         try {
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
    if (!admin.apps.length) {
        return null;
    }
    return admin.firestore();
}

export async function getStorage() {
    if (!admin.apps.length) {
        return null;
    }
    return admin.storage();
}

export async function getAuth() {
    if (!admin.apps.length) {
        return null;
    }
    return admin.auth();
}
