'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A client-side component that listens for Firestore permission errors
 * and throws them to be caught by the Next.js error overlay during development.
 * This component does not render any UI.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throwing the error here will cause it to be displayed
      // in the Next.js development error overlay.
      // This is intentional and provides rich, contextual error
      // messages to aid in debugging security rules.
      throw error;
    };

    // Subscribe to permission errors
    errorEmitter.on('permission-error', handleError);

    // Cleanup subscription on component unmount
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component does not render anything
}
