# Development Guide

This document provides information for developers working on the WARP Interactive Quiz project, including setup instructions, testing procedures, and common development tasks.

## Local Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Git
- Firebase CLI (`npm install -g firebase-tools`)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/etainkiely/etainkiely-com.git
   cd etainkiely-com/quiz-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Git hooks (automatically set up with Husky on npm install):
   ```bash
   npm run prepare
   ```

4. Create environment files:
   - Copy `.env.example` to `.env.local`
   - Update the Firebase configuration values in `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

### Environment Files

The project uses multiple environment files for different deployment stages:

- `.env.development` - Development environment (local)
- `.env.staging` - Staging/testing environment
- `.env.production` - Production environment
- `.env.local` - Local overrides (not committed to Git)

### Firebase Configuration

To configure Firebase for different environments:

1. Create a Firebase project for each environment (dev, staging, prod)
2. Update the corresponding environment files with the correct Firebase config values
3. For local development, use Firebase emulators

### Firebase Emulator Setup

1. Ensure Firebase CLI is installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Start the local emulators:
   ```bash
   npm run firebase:emulators
   ```

This will start the following emulators:
- Firestore: http://localhost:8080
- Authentication: http://localhost:9099
- Firebase UI: http://localhost:4000

## Testing Procedures

### Running Tests

- Run all tests once:
  ```bash
  npm run test
  ```

- Run tests in watch mode during development:
  ```bash
  npm run test:watch
  ```

- Generate test coverage report:
  ```bash
  npm run test:coverage
  ```

### Writing Tests

- Unit tests for components should be placed in `__tests__` folders next to the components
- Tests for hooks should be in `src/hooks/__tests__`
- Tests for utility functions should be in `src/utils/__tests__`

### Test Structure

Follow the AAA (Arrange-Act-Assert) pattern for test structure:

```typescript
test('component renders correctly', () => {
  // Arrange
  render(<Component prop="value" />);
  
  // Act
  const element = screen.getByText('Expected Text');
  
  // Assert
  expect(element).toBeInTheDocument();
});
```

## Common Development Tasks

### Adding a New Component

1. Create a new directory in `src/components` for your component
2. Add the component file, styles, and tests
3. Export the component from the component's index.ts file
4. Import and use the component where needed

Example:
```typescript
// src/components/NewComponent/NewComponent.tsx
import './NewComponent.css';

interface NewComponentProps {
  title: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
  return <div className="new-component">{title}</div>;
};

export default NewComponent;
```

### Adding a New Quiz Question

1. Add the question to the appropriate age group in `src/data/questions.ts`
2. Ensure it follows the correct structure with answers, explanation, etc.
3. Add any required images to the `public/images/questions` directory

### Working with Firebase

#### Creating a New Collection

1. Define the collection's TypeScript interface in `src/types/database.ts`
2. Add security rules for the collection in `firestore.rules`
3. Create service functions in `src/services/dataService.ts`

#### Updating Security Rules

1. Edit `firestore.rules` to add or modify rules
2. Test the rules locally using the Firebase emulator
3. Deploy the rules using:
   ```bash
   npm run firebase:deploy:rules
   ```

## Deployment

### Development Deployment

```bash
npm run build:dev
npm run deploy:gh-pages
```

### Production Deployment

```bash
npm run build:prod
npm run deploy
```

Alternatively, push to the main branch to trigger the GitHub Actions workflow.

## Troubleshooting

### Common Issues

1. **Firebase connection issues**
   - Check that Firebase config values are correct
   - Ensure Firebase service is up and running
   - Check if Firebase emulator is running when in development

2. **TypeScript errors**
   - Run `npm run type-check` to see all type errors
   - Ensure interfaces are properly defined for new components/features

3. **Test failures**
   - Check the test output for specific error messages
   - Run tests in watch mode for immediate feedback: `npm run test:watch`

### Getting Help

If you encounter issues that aren't covered here:

1. Check the [Firebase documentation](https://firebase.google.com/docs)
2. Refer to the [React documentation](https://reactjs.org/docs/getting-started.html)
3. Consult with the project team

