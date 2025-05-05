# Firebase Configuration Guide

This guide will walk you through setting up a new Firebase project and configuring all the necessary services for your quiz application.

## Prerequisites

- A Google account
- Firebase Terms of Service accepted
- Google Cloud Terms of Service accepted

## 1. Creating a New Firebase Project

### Step 1: Access the Firebase Console

1. Navigate to the [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account if prompted

### Step 2: Create a New Project

1. Click on the **"Add project"** button
   
   ![Add Project Button](screenshots/add_project.png)

2. Enter a project name (e.g., "WARP Quiz App")
   
   ![Enter Project Name](screenshots/enter_project_name.png)

3. Choose whether to enable Google Analytics (recommended)
   
   ![Enable Analytics](screenshots/enable_analytics.png)

4. Select your Analytics account settings (create a new one if needed)
   
   ![Analytics Account](screenshots/analytics_account.png)

5. Review and accept the terms, then click **"Create project"**
   
   ![Accept Terms](screenshots/accept_terms.png)

6. Wait for the project to be created
   
   ![Project Creation](screenshots/project_creation.png)

7. Click **"Continue"** once the project is ready

## 2. Setting Up Firestore Database

### Step 1: Create a Firestore Database

1. In the Firebase console, select your newly created project
2. In the left sidebar, click on **"Build"** and then **"Firestore Database"**
   
   ![Firestore Navigation](screenshots/firestore_navigation.png)

3. Click **"Create database"**
   
   ![Create Database](screenshots/create_database.png)

4. Choose a starting mode:
   - For development, select **"Start in test mode"**
   - For production, select **"Start in production mode"**
   
   ![Database Mode](screenshots/database_mode.png)

5. Select a location for your database (choose the closest region to your users)
   
   ![Database Location](screenshots/database_location.png)

6. Click **"Enable"** and wait for the database to be created

### Step 2: Set Up Security Rules

1. Navigate to the **"Rules"** tab in Firestore
   
   ![Firestore Rules](screenshots/firestore_rules.png)

2. Our project already has comprehensive rules in `firestore.rules`, but you can review them here
3. You can click **"Publish"** to apply any rule changes

## 3. Setting Up Authentication

### Step 1: Enable Authentication

1. In the left sidebar, click on **"Build"** and then **"Authentication"**
   
   ![Authentication Navigation](screenshots/auth_navigation.png)

2. Click **"Get started"**
   
   ![Auth Get Started](screenshots/auth_get_started.png)

### Step 2: Set Up Sign-in Methods

1. Click on the **"Sign-in method"** tab
   
   ![Sign-in Method](screenshots/sign_in_method.png)

2. Enable the authentication methods you want to use:
   - **Email/Password**: Click on "Email/Password", toggle the switch to enable it, then click "Save"
   
   ![Enable Email Auth](screenshots/enable_email_auth.png)
   
   - **Google**: Click on "Google", toggle the switch to enable it, enter your app information, then click "Save"
   
   ![Enable Google Auth](screenshots/enable_google_auth.png)

3. You can also enable other authentication methods as needed (Apple, Facebook, etc.)

## 4. Setting Up Storage

### Step 1: Create a Storage Bucket

1. In the left sidebar, click on **"Build"** and then **"Storage"**
   
   ![Storage Navigation](screenshots/storage_navigation.png)

2. Click **"Get started"**
   
   ![Storage Get Started](screenshots/storage_get_started.png)

3. Choose security rules for your storage:
   - For development, select **"Start in test mode"**
   - For production, set up proper security rules
   
   ![Storage Rules](screenshots/storage_rules.png)

4. Select a location for your storage bucket (use the same region as your Firestore database)
   
   ![Storage Location](screenshots/storage_location.png)

5. Click **"Done"** to create the storage bucket

### Step 2: Set Up Storage Rules

1. Navigate to the **"Rules"** tab in Storage
   
   ![Storage Rules Tab](screenshots/storage_rules_tab.png)

2. For development, you can use the default rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. Click **"Publish"** to apply the rules

## 5. Getting the Configuration Values

### Step 1: Register Your Web App

1. From the project overview page, click on the web icon (`</>`) to add a web app
   
   ![Add Web App](screenshots/add_web_app.png)

2. Enter a nickname for your app (e.g., "WARP Quiz App Web")
   
   ![Register App](screenshots/register_app.png)

3. Optional: Check the "Also set up Firebase Hosting" box if you want to set up hosting
4. Click **"Register app"**

### Step 2: Copy the Configuration

1. After registering, you'll see the Firebase configuration object:
   
   ![Firebase Config](screenshots/firebase_config.png)

2. Copy the entire configuration object that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   };
   ```

### Step 3: Update Environment Variables

1. Open the `.env.development` file in your project
2. Update the environment variables with your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   
   # Development specific flags
   VITE_USE_FIREBASE_EMULATORS=true
   ```

3. Similarly, update the `.env.production` file with the same configuration values, but set `VITE_USE_FIREBASE_EMULATORS=false`

## 6. Initialize Firebase in Your Local Project

### Step 1: Link Your Local Project

1. Open a terminal in your project root directory
2. Run the following command to initialize Firebase:
   ```bash
   npx firebase-tools init
   ```

3. Select the services you want to use (Firestore, Authentication, Storage, Hosting, Emulators)
4. Choose your newly created Firebase project when prompted
5. Follow the prompts to complete the setup:
   - Accept default file names for Firestore and Storage rules
   - Configure the public directory for Hosting if needed
   - Set up Emulators for local development

### Step 2: Deploy Firestore Rules and Indexes

1. Deploy your Firestore security rules:
   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```

2. Deploy your Firestore indexes:
   ```bash
   npx firebase-tools deploy --only firestore:indexes
   ```

## Conclusion

Your Firebase project is now set up with all the necessary services:
- Firestore Database for storing data
- Authentication for user management
- Storage for storing files

The configuration values have been added to your environment files, and your local project is connected to Firebase. You can now use the Firebase services in your application as shown in the `src/firebase/README.md` file.

