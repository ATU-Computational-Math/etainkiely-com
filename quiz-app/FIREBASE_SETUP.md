# Firebase Setup Guide

This guide will walk you through setting up Firebase for your quiz application, including installation of necessary tools, project configuration, and environment setup.

## Prerequisites

- Node.js (14.x or later)
- npm (6.x or later)
- A Google account

## 1. Installing and Configuring the Firebase CLI

### Installation

The Firebase CLI (Command Line Interface) is required for deploying to Firebase, as well as running local emulators for development. While the project already has `firebase-tools` in the devDependencies, you'll need to install it globally to use the `firebase` command directly from your terminal.

```powershell
# Install Firebase CLI globally
npm install -g firebase-tools
```

### Logging In

After installation, log in to your Google account:

```powershell
# Log in to Firebase
firebase login
```

This will open a browser window where you can authenticate with your Google account.

## 2. Firebase Project Setup

### Option A: Create a New Firebase Project

1. Visit the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "quiz-app")
4. Choose whether to enable Google Analytics (recommended)
5. Follow the prompts to complete project creation

### Option B: Use an Existing Firebase Project

If you already have a Firebase project, you can use it for this application.

## 3. Obtaining Firebase Configuration Values

Once your project is created, you need to get the configuration values:

1. In the Firebase Console, go to your project
2. Click on the gear icon (⚙️) next to "Project Overview"
3. Select "Project settings"
4. Scroll down to "Your apps" section
5. If you haven't added a web app yet:
   - Click on the web icon (</>) to add a web app
   - Register the app with a nickname (e.g., "quiz-app-web")
   - You can skip the Firebase Hosting setup for now
6. Under the "SDK setup and configuration" section, select "Config" radio button
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..." // If you enabled Analytics
};
```

## 4. Setting Up Environment Variables

Now that you have your Firebase configuration, you need to update the environment variables in your project:

### For Development Environment

1. Open the `.env.development` file in the project root
2. Replace the placeholder values with your actual Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development specific flags
VITE_USE_FIREBASE_EMULATORS=true
```

### For Production Environment

Similarly, update the `.env.production` file with the same configuration values. You might want to disable emulators in production:

```
VITE_USE_FIREBASE_EMULATORS=false
```

## 5. Initializing Firebase in Your Project

The Firebase configuration is already set up in `src/firebase/config.ts`. It initializes:
- Firebase App
- Firestore Database
- Authentication
- Storage

To use these services in your components, import them from this file:

```typescript
import { auth, firestore, storage } from '../firebase/config';
```

## 6. Setting Up Firebase Emulators for Local Development

Firebase Emulators allow you to run Firebase services locally without affecting your production environment.

### Initialize Firebase in the Project (if not already done)

```powershell
# Run from the project root
firebase init
```

Select the following features when prompted:
- Firestore
- Authentication
- Storage (if needed)
- Emulators

Follow the prompts to complete the setup.

### Configure Emulators

When prompted to set up emulators, select:
- Authentication Emulator
- Firestore Emulator
- Storage Emulator (if needed)

Accept the default ports or specify your own.

### Starting Emulators

To start the emulators for local development:

```powershell
# Using npm script (recommended)
npm run firebase:emulators

# Or directly with Firebase CLI
firebase emulators:start
```

### Connecting to Emulators

The `src/firebase/config.ts` file already includes code to connect to the emulators when in development mode and when `VITE_USE_FIREBASE_EMULATORS` is set to `'true'`.

## Troubleshooting

### Firebase CLI Not Found

If you get a "firebase command not found" error:

1. Check if it's installed properly:
   ```powershell
   npm list -g firebase-tools
   ```

2. If installed but still not found, you may need to add the npm global bin directory to your PATH:
   ```powershell
   # Find the npm global bin directory
   npm config get prefix
   
   # Add it to your PATH (add this to your PowerShell profile)
   $env:PATH += ";C:\Users\YourUsername\AppData\Roaming\npm"
   ```

3. Alternatively, you can use npx:
   ```powershell
   npx firebase-tools login
   npx firebase-tools init
   ```

### Emulator Connection Issues

If your app isn't connecting to the emulators:

1. Ensure the emulators are running
2. Verify the `VITE_USE_FIREBASE_EMULATORS` is set to `'true'` in your `.env.development` file
3. Check that the emulator host and ports in `src/firebase/config.ts` match your emulator configuration

## Next Steps

1. Set up Firebase Authentication providers (Google, Email/Password, etc.)
2. Design your Firestore data model
3. Set up security rules for Firestore and Storage
4. Configure Firebase Hosting for deployment

For more information, refer to the [Firebase Documentation](https://firebase.google.com/docs).

