
import * as functions from 'firebase-functions';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK
import { initializeApp } from 'firebase-admin/app';
initializeApp();

export const generateDownloadLink = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to access this resource.'
    );
  }

  const filePath = data.filePath;
  if (!filePath) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with one argument "filePath".'
    );
  }

  // Get a reference to the storage bucket
  const bucket = getStorage().bucket();

  // Create a signed URL for the file
  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  try {
    const [url] = await bucket.file(filePath).getSignedUrl(options);
    return { downloadUrl: url };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Unable to generate download link.'
    );
  }
});
