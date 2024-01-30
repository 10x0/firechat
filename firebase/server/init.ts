import 'server-only';

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { auth, firestore } from 'firebase-admin';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  firestore().settings({
    ignoreUndefinedProperties: true,
  });
}

const serverAuth = auth();

const serverDb = firestore();

export { serverAuth, serverDb };
