# WARP: Generational Interactive Quiz

An interactive quiz web application designed for different age groups (Young Heroes, Mid-Generation Protectors, Wisdom Keepers) with unlockable challenges, leaderboards, badges, and social sharing capabilities.

## Features

- **Age-Specific Content**: Tailored questions for different age groups
- **Progressive Difficulty**: Questions adapt based on user responses
- **Ultimate Challenge**: Special unlockable advanced quiz mode
- **Badges & Achievements**: Reward system for accomplishments
- **Leaderboards**: Weekly, monthly, and all-time rankings
- **School/Team Competition**: Group participation through school codes
- **Social Sharing**: Share results on social media
- **Responsive Design**: Works on all device sizes

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: React Hooks
- **Backend/Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Styling**: CSS with responsive design
- **Hosting**: GitHub Pages + Firebase

## Project Structure

```
/quiz-app
│
├── /public                 # Static assets
│   ├── /images             # Image assets
│   │   ├── /badges         # Badge icons
│   │   └── /questions      # Question images
│   └── /favicon.ico
│
├── /src                    # Application source code
│   ├── /components         # React components
│   │   ├── AgeSelector.tsx     # Age group selection
│   │   ├── Quiz.tsx            # Main quiz component
│   │   ├── UltimateChallenge.tsx  # Advanced challenge
│   │   ├── Leaderboard.tsx     # Rankings display
│   │   ├── BadgeDisplay.tsx    # User badges
│   │   └── ShareCard.tsx       # Social sharing
│   │
│   ├── /services           # API and service functions
│   │   ├── firebase.ts         # Firebase configuration
│   │   └── dataService.ts      # Data operations
│   │
│   ├── /types              # TypeScript type definitions
│   │   └── database.ts         # Database schema types
│   │
│   ├── /data               # Static data
│   │   └── questions.ts        # Sample quiz questions
│   │
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
│
├── /firebaseConfig.js      # Firebase configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Setup and Installation

1. **Clone the repository**
   ```
   git clone https://github.com/yourorganization/quiz-app.git
   cd quiz-app
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore and Authentication services
   - Update `src/services/firebase.ts` with your Firebase configuration

4. **Start the development server**
   ```
   npm run dev
   ```

5. **Build for production**
   ```
   npm run build
   ```

## Firestore Database Structure

- **users**: User profiles and progress
- **questions**: Quiz questions organized by age group
- **quizAttempts**: Records of completed quizzes
- **leaderboard**: Rankings for different timeframes
- **badges**: Available badges and criteria
- **userBadges**: Badges earned by users
- **themes**: Weekly quiz themes
- **schools**: School/team information

## Firebase Security Rules

Basic security rules for the Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to questions, badges, themes, and leaderboard
    match /questions/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /badges/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /themes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /leaderboard/{entry} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               (request.auth.uid == resource.data.userId || 
                                request.auth.token.admin == true);
    }
    
    // Restrict access to user-specific data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                            (request.auth.uid == userId || 
                             request.auth.token.admin == true);
    }
    
    match /quizAttempts/{attempt} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || 
                      request.auth.token.admin == true);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if false;  // Immutable records
    }
    
    match /userBadges/{badge} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || 
                      request.auth.token.admin == true);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if false;  // Cannot delete badges
    }
    
    match /schools/{code} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Content Management

Question content is stored in JSON format and can be updated through:

1. Direct edits to the questions collections in Firestore
2. Batch updates using the Firebase Admin SDK
3. Import/export functions in the app for administrators

## Development Guidelines

- Follow the established component patterns
- Maintain type safety with TypeScript
- Document all functions and components
- Test on multiple devices and browsers
- Use semantic versioning for releases

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Project Link: [https://github.com/yourorganization/quiz-app](https://github.com/yourorganization/quiz-app)

# WARP Generational Interactive Quiz

This interactive quiz web app features generational levels (Young Heroes, Mid-Generation Protectors, Wisdom Keepers), unlockable "Ultimate Challenge," leaderboards, badges, and weekly themes.

## Project Structure

```
/quiz-app
  /public
    /images
    /badges
  /src
    /components
      AgeSelector.tsx
      Quiz.tsx
      UltimateChallenge.tsx
      Leaderboard.tsx
      BadgeDisplay.tsx
      ShareCard.tsx
    /data
      questions_young.json
      questions_mid.json
      questions_elder.json
      questions_ultimate.json
      themes.json
    /services
      firebase.ts
      userService.ts
      quizService.ts
    App.tsx
    index.tsx
  firebaseConfig.ts
```

## Development

To start the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

## Content Management

Quiz questions, themes, and badges are stored as JSON files in the `/src/data` directory. To update the content:

1. Edit the corresponding JSON file in the `/src/data` directory
2. Ensure the structure matches the existing format
3. Commit changes to the repository

## Technologies Used

- React with TypeScript
- Firebase for backend services
- Vite for build tooling
- GitHub Pages for hosting

