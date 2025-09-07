
'use server';

import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error('Failed to parse SERVICE_ACCOUNT or initialize firebase-admin', e);
    }
}


const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

export { db, storage, auth };
