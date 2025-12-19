
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
  const sessionCookie = (await cookies()).get('session')?.value || '';

  if (!sessionCookie) {
    return null;
  }

  try {
    // Set checkRevoked to true, which will check if the session cookie is revoked.
    // This is a security measure to ensure that compromised sessions can be invalidated.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    // Session cookie is invalid, expired, or revoked.
    // This is an expected error in many cases, so we don't need to log it as a server error.
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
