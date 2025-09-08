
'use server';
import admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { DecodedIdToken } from 'firebase-admin/auth';

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (e: any) {
        console.error('Firebase Admin SDK initialization error:', e.stack);
        throw new Error('Failed to initialize Firebase Admin SDK. Please check server logs for details.');
    }
}


export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  initializeFirebaseAdmin();
  const session = (await cookies()).get('session')?.value || '';

  if (!session) {
    return null;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(session, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
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
