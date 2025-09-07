
'use server';

import admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    if (serviceAccountString) {
        const serviceAccount = JSON.parse(serviceAccountString);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
    } else {
        // Use application default credentials if service account is not provided
        app = admin.initializeApp();
    }
  } catch (e: any) {
    console.error("Firebase Admin SDK initialization error:", e.stack);
    // If it's already initialized, which can happen in dev environments,
    // just get the existing app.
    if (e.message.includes('already exists')) {
        app = admin.app();
    } else {
        throw e;
    }
  }
} else {
  app = admin.app();
}


const db = admin.firestore(app);
const auth = admin.auth(app);
const storage = admin.storage(app);

export const getDb = async () => db;
export const getAuth = async () => auth;
export const getStorage = async () => storage;
