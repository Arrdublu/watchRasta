'use server';

import admin from 'firebase-admin';

const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        if (process.env.SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            console.warn("Firebase Admin SERVICE_ACCOUNT not found, skipping initialization. This is expected during local development without credentials.");
        }
    }
};

initializeFirebaseAdmin();

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

export { db, storage, auth };
