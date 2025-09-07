
'use server';

import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export const getDb = async () => db;
export const getAuth = async () => auth;
export const getStorage = async () => storage;
