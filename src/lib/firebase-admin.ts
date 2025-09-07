
'use server';

import admin from 'firebase-admin';

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT as string);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

export { db, storage, auth };
