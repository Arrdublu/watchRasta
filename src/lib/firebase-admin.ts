
'use server';

import admin from 'firebase-admin';

let app;

try {
    app = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT!)),
    });
} catch (e: any) {
    if (e.code === 'auth/invalid-credential') {
        console.log("Firebase Admin SDK already initialized.");
        app = admin.app();
    } else {
        console.error("Firebase Admin SDK initialization error:", e);
        throw e;
    }
}

const db = admin.firestore(app);
const auth = admin.auth(app);
const storage = admin.storage(app);

export const getDb = async () => db;
export const getAuth = async () => auth;
export const getStorage = async () => storage;
