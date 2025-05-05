# Firebase Quick-Start Guide

This guide provides a brief overview of how to use the Firebase services that have been initialized in this project. For detailed setup instructions, please refer to the [`FIREBASE_SETUP.md`](../../FIREBASE_SETUP.md) file in the project root.

## Overview of Initialized Firebase Services

The following Firebase services have been initialized in [`config.ts`](./config.ts):

1. **Firebase App** - The core Firebase client-side application
2. **Firestore** - NoSQL document database for storing and syncing data
3. **Authentication** - User authentication and authorization
4. **Storage** - File storage for user-generated content

## Using Firebase Services in React Components

To use any of the Firebase services in your components, simply import them from the `config.ts` file:

```typescript
import { auth, firestore, storage } from '../firebase/config';
```

## Example Usage for Common Operations

### Authentication

#### Sign Up with Email and Password

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};
```

#### Sign In with Email and Password

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};
```

#### Sign Out

```typescript
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const logOut = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
```

#### Using Auth State in a Component

```typescript
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={logOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in</p>
          {/* Sign in form */}
        </div>
      )}
    </div>
  );
};
```

### Firestore

#### Reading Data

```typescript
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Get all documents from a collection
const getQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'questions'));
    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return questions;
  } catch (error) {
    console.error('Error getting questions:', error);
    throw error;
  }
};

// Query with filters
const getQuestionsForAgeGroup = async (ageGroup: string) => {
  try {
    const q = query(
      collection(firestore, 'questions'),
      where('ageGroup', '==', ageGroup),
      orderBy('difficulty'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return questions;
  } catch (error) {
    console.error('Error getting filtered questions:', error);
    throw error;
  }
};
```

#### Writing Data

```typescript
import { doc, setDoc, addDoc, collection, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Add a document with auto-generated ID
const addQuizAttempt = async (attemptData) => {
  try {
    const docRef = await addDoc(collection(firestore, 'quizAttempts'), {
      userId: auth.currentUser?.uid,
      dateCompleted: new Date(),
      ...attemptData
    });
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Add a document with a specific ID
const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(firestore, 'users', userId), {
      createdAt: new Date(),
      ...userData
    });
    console.log('User profile created');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Update a document
const updateUserScore = async (userId, newScore) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      totalPoints: newScore,
      updatedAt: new Date()
    });
    console.log('User score updated');
  } catch (error) {
    console.error('Error updating user score:', error);
    throw error;
  }
};

// Delete a document
const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(firestore, 'questions', questionId));
    console.log('Question deleted');
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};
```

#### Real-time Updates

```typescript
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Real-time updates for a single document
const UserProfileComponent = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          setProfile({ id: doc.id, ...doc.data() });
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to user profile:', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h2>{profile.displayName}</h2>
      <p>Total Points: {profile.totalPoints}</p>
    </div>
  );
};

// Real-time updates for a collection
const LeaderboardComponent = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(firestore, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaderboard(entries);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to leaderboard:', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry) => (
          <li key={entry.id}>
            {entry.displayName}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Storage

#### Uploading Files

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const uploadProfileImage = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profileImages/${userId}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded successfully. Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
```

#### Downloading Files

```typescript
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const getProfileImageURL = async (userId) => {
  try {
    const storageRef = ref(storage, `profileImages/${userId}`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};
```

## Additional Resources

For more detailed information on Firebase services and APIs, please refer to:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)
- Project setup instructions in [`FIREBASE_SETUP.md`](../../FIREBASE_SETUP.md)

## Troubleshooting

If you encounter issues with Firebase:

1. Check that your environment variables are correctly set in the appropriate `.env` files
2. Verify that you have the correct Firebase project configuration
3. For local development, ensure that the Firebase emulators are running if you're using them
4. Check the browser console for specific error messages

