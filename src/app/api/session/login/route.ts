
import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getDb, initializeFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  initializeFirebaseAdmin();
  const reqBody = (await request.json()) as { idToken: string };
  const idToken = reqBody.idToken;

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

    const db = await getDb();
    const userRef = db.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        await userRef.set({
            email: decodedToken.email,
            displayName: decodedToken.name,
            photoURL: decodedToken.picture,
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        });
    }

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(options);
    return response;

  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
