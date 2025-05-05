# Firebase Setup Troubleshooting Guide

## Current Status
- Project ID: quiz-app-warp
- Web App: Successfully configured
- Realtime Database: Created
- Missing Services: Firestore, Authentication, Storage

## Step 1: Verify Project Ownership
1. Go to: https://console.firebase.google.com/project/quiz-app-warp/settings/general
2. Under "Project settings", verify you're listed as an Owner
3. If not, look for "Add member" button and add yourself as Owner

## Step 2: Enable Required APIs
1. Go to: https://console.cloud.google.com/apis/dashboard?project=quiz-app-warp
2. Click "ENABLE APIS AND SERVICES"
3. Search for and enable each:
   - Cloud Firestore API
   - Firebase Authentication API
   - Cloud Storage for Firebase
   - Cloud Resource Manager API

## Step 3: Verify Billing
1. Go to: https://console.cloud.google.com/billing/linkedaccount?project=quiz-app-warp
2. Ensure a billing account is linked
3. If not, create one (required even for free tier)

## Step 4: Create Firestore Database
1. Go to: https://console.firebase.google.com/project/quiz-app-warp/firestore
2. Click "Create Database"
3. Choose "Start in test mode"
4. Select "eur3 (europe-west)" location

## Step 5: Enable Authentication
1. Go to: https://console.firebase.google.com/project/quiz-app-warp/authentication
2. Click "Get Started"
3. Enable Email/Password provider
4. Enable Google Sign-in (optional)

## Step 6: Set Up Storage
1. Go to: https://console.firebase.google.com/project/quiz-app-warp/storage
2. Click "Get Started"
3. Choose "Start in test mode"
4. Select "eur3 (europe-west)" location

## Troubleshooting Permission Issues
If you encounter "You need additional access":
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=quiz-app-warp
2. Find your email (etain.kiely@gmail.com)
3. Click the pencil icon
4. Add these roles if missing:
   - Firebase Admin
   - Project Owner
   - Cloud Build Service Account

## Web App Configuration
Your web app is already configured with these settings:
```javascript
{
  "projectId": "quiz-app-warp",
  "appId": "1:838690354794:web:df73c57c785346db6d3c13",
  "databaseURL": "https://quiz-app-warp-default-rtdb.europe-west1.firebasedatabase.app",
  "storageBucket": "quiz-app-warp.firebasestorage.app",
  "apiKey": "AIzaSyCep0Hq2czFi5ndJPPR3DMvwbcJFpJqn0I",
  "authDomain": "quiz-app-warp.firebaseapp.com",
  "messagingSenderId": "838690354794"
}
```

Please follow these steps in order and let me know at which step you encounter any issues.

