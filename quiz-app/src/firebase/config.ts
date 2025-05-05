import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required configuration
const validateConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missingFields.join(', ')}. 
      Please check your .env file and ensure all required Firebase variables are set.`
    );
  }
};

// Initialize Firebase
let firebaseApp;
let firestore;
let auth;
let storage;

try {
  validateConfig();
  firebaseApp = initializeApp(firebaseConfig);
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);

  // Connect to Firebase emulators if in development mode
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    // Default emulator ports, these could also be environment variables
    const EMULATOR_HOST = 'localhost';
    const AUTH_EMULATOR_PORT = 9099;
    const FIRESTORE_EMULATOR_PORT = 8080;
    const STORAGE_EMULATOR_PORT = 9199;

    try {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`);
      connectFirestoreEmulator(firestore, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
      connectStorageEmulator(storage, EMULATOR_HOST, STORAGE_EMULATOR_PORT);
      console.log('Connected to Firebase emulators');
    } catch (error) {
      console.error('Failed to connect to Firebase emulators:', error);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Re-throw to make sure the app doesn't continue with invalid Firebase setup
}

export { firebaseApp, firestore, auth, storage };

