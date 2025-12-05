// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
} else if (getApps().length) {
  app = getApp();
} else {
  // During SSR or build, we might not initialize the client-side Firebase app
  // if not explicitly needed, or handle it differently.
  // For now, if no window object and no existing apps, we'll avoid init.
  // This helps prevent issues during Next.js build.
  // A robust solution might involve passing a separate admin app or
  // handling server-side data fetching without client-side SDK init here.
  console.warn("Firebase client-side app not initialized (likely SSR/Build).");
}

// Export Firebase services (conditionally initialize auth and db)
let auth = null;
let db = null;

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
