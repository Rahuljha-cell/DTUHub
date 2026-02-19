import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

let _app: FirebaseApp | null = null;
let _rtdb: Database | null = null;

function getFirebaseApp() {
  if (_app) return _app;

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return _app;
}

export function getRtdb() {
  if (_rtdb) return _rtdb;
  _rtdb = getDatabase(getFirebaseApp());
  return _rtdb;
}

export default getFirebaseApp;
