import { useState, useEffect } from 'react';
import './App.css';
import AgeSelector, { AgeGroup } from './components/AgeSelector';
import Quiz from './components/Quiz';
import UltimateChallenge from './components/UltimateChallenge';
import Leaderboard from './components/Leaderboard';
import BadgeDisplay from './components/BadgeDisplay';
import ShareCard from './components/ShareCard';
import { Achievement } from './components/UltimateChallenge';

// App stage types
type AppStage = 
  | 'welcome' 
  | 'age-selection' 
  | 'quiz' 
  | 'quiz-results' 
  | 'ultimate-challenge' 
  | 'ultimate-results'
  | 'leaderboard'
  | 'badges'
  | 'share';

// User data interface
interface UserData {
  username: string;
  ageGroup: AgeGroup;
  completedQuizzes: string[];
  scores: Record<string, number>;
  badges: Badge[];
  currentStreak: number;
  bestStreak: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  id?: string; // For leaderboard identification
}

// Badge interface (extended from Achievement but with more fields)
interface Badge extends Achievement {
  category: 'achievement' | 'streak' | 'mastery' | 'special';
  progress?: {
    current: number;
    target: number;
  };
}

function App() {
  // Current app stage
  const [appStage, setAppStage] = useState<AppStage>('welcome');
  
  // User selection and data
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);
  const [userData, setUserData] = useState<UserData>({
    username: 'Biodiversity Hero', // Default username
    ageGroup: null,
    completedQuizzes: [],
    scores: {},
    badges: [],
    currentStreak: 0,
    bestStreak: 0,
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
  });
  
  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizTotalPossible, setQuizTotalPossible] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  
  // Ultimate challenge state
  const [ultimateUnlocked, setUltimateUnlocked] = useState<boolean>(false);
  const [ultimateScore, setUltimateScore] = useState<number>(0);
  const [ultimateTotalPossible, setUltimateTotalPossible] = useState<number>(0);
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  
  // Weekly theme (would typically be fetched from an API or database)
  const [weeklyTheme, setWeeklyTheme] = useState<string>('Biodiversity and Climate Change');
  
  // Check for unlockable badges and achievements
  useEffect(() => {
    // This would be more sophisticated in a real app with server-side validation
    if (quizCompleted) {
      const scorePercentage = (quizScore / quizTotalPossible) * 100;
      const newBadges: Badge[] = [...userData.badges];
      
      // First completion badge
      if (!userData.badges.some(badge => badge.id === 'first_quiz')) {
        newBadges.push({
          id: 'first_quiz',
          title: 'First Steps',
          description: 'Completed your first biodiversity quiz',
          icon: '🌱',
          unlocked: true,
          dateUnlocked: new Date(),
          isNew: true,
          category: 'achievement'
        });
      }
      
      // Score badges
      if (scorePercentage >= 80 && !userData.badges.some(badge => badge.id === 'high_score')) {
        newBadges.push({
          id: 'high_score',
          title: 'High Achiever',
          description: 'Scored 80% or higher on a quiz',
          icon: '🏅',
          unlocked: true,
          dateUnlocked: new Date(),
          isNew: true,
          category: 'achievement'
        });
      }
      
      // Perfect score badge
      if (scorePercentage === 100 && !userData.badges.some(badge => badge.id === 'perfect_score')) {
        newBadges.push({
          id: 'perfect_score',
          title: 'Perfect Score',
          description: 'Achieved a perfect score on a quiz',
          icon: '✨',
          unlocked: true,
          dateUnlocked: new Date(),
          isNew: true,
          category: 'achievement'
        });
      }
      
      // Update user data with new badges
      setUserData(prev => ({
        ...prev,
        badges: newBadges
      }));
      
      // Check if ultimate challenge is unlocked
      if (scorePercentage >= 70 && !ultimateUnlocked) {
        setUltimateUnlocked(true);
      }
    }
  }, [quizCompleted, quizScore, quizTotalPossible, userData.badges, ultimateUnlocked]);
  
  // Handle the earned achievements from Ultimate Challenge
  useEffect(() => {
    if (earnedAchievements.length > 0) {
      const newBadges = [...userData.badges];
      
      earnedAchievements.forEach(achievement => {
        if (!userData.badges.some(badge => badge.id === achievement.id)) {
          newBadges.push({
            ...achievement,
            category: 'special',
            isNew: true,
            dateUnlocked: new Date()
          } as Badge);
        }
      });
      
      setUserData(prev => ({
        ...prev,
        badges: newBadges
      }));
    }
  }, [earnedAchievements, userData.badges]);
  
  // Age selection handler
  const handleAgeGroupSelect = (selectedAgeGroup: AgeGroup) => {
    setAgeGroup(selectedAgeGroup);
    setUserData(prev => ({ ...prev, ageGroup: selectedAgeGroup }));
    setAppStage('age-selection');
  };
  
  // Start quiz handler
  const startQuiz = () => {
    if (ageGroup) {
      setQuizCompleted(false);
      setQuizScore(0);
      setQuizTotalPossible(0);
      setAppStage('quiz');
    }
  };
  
  // Quiz completion handler
  const handleQuizFinish = (score: number, totalPossible: number) => {
    setQuizScore(score);
    setQuizTotalPossible(totalPossible);
    setQuizCompleted(true);
    
    // Update user data
    setUserData(prev => {
      const now = new Date();
      const quizId = `${ageGroup}-${now.toISOString()}`;
      
      return {
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
        scores: { ...prev.scores, [quizId]: score },
        totalQuestionsAnswered: prev.totalQuestionsAnswered + (totalPossible / 10), // Assuming 10 points per question
        correctAnswersCount: prev.correctAnswersCount + (score / 10), // Assuming 10 points per correct answer
      };
    });
    
    setAppStage('quiz-results');
  };
  
  // Start ultimate challenge handler
  const startUltimateChallenge = () => {
    setAppStage('ultimate-challenge');
  };
  
  // Ultimate challenge completion handler
  const handleUltimateFinish = (score: number, totalPossible: number, achievements: Achievement[]) => {
    setUltimateScore(score);
    setUltimateTotalPossible(totalPossible);
    setEarnedAchievements(achievements);
    
    // Update user data
    setUserData(prev => {
      const now = new Date();
      const quizId = `ultimate-${now.toISOString()}`;
      
      return {
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
        scores: { ...prev.scores, [quizId]: score },
      };
    });
    
    setAppStage('ultimate-results');
  };
  
  // Navigation handlers
  const goToLeaderboard = () => {
    setAppStage('leaderboard');
  };
  
  const goToBadges = () => {
    setAppStage('badges');
  };
  
  const goToShare = () => {
    setAppStage('share');
  };
  
  const goToHome = () => {
    setAppStage('welcome');
  };
  
  // Username change handler (could be expanded with a form)
  const handleUsernameChange = (newUsername: string) => {
    setUserData(prev => ({
      ...prev,
      username: newUsername
    }));
  };
  
  // Render the current stage
  const renderStage = () => {
    switch (appStage) {
      case 'welcome':
        return (
          <div className="welcome-screen">
            <h2>Welcome to the Biodiversity Quiz Challenge!</h2>
            <p className="intro-text">
              Join our exciting biodiversity quiz designed for all ages. 
              Learn about the amazing diversity of life on our planet while having fun!
            </p>
            <div className="theme-announcement">
              <h3>This Week's Theme:</h3>
              <p className="theme-text">{weeklyTheme}</p>
            </div>
            <button 
              className="primary-button" 
              onClick={() => setAppStage('age-selection')}
            >
              Start Your Adventure
            </button>
          </div>
        );
        
      case 'age-selection':
        return (
          <div className="age-selection-screen">
            <AgeSelector 
              onSelectAgeGroup={handleAgeGroupSelect} 
              selectedAgeGroup={ageGroup} 
            />
            
            {ageGroup && (
              <button className="start-quiz-button" onClick={startQuiz}>
                Start Your Biodiversity Adventure!
              </button>
            )}
          </div>
        );
        
      case 'quiz':
        return (
          <Quiz 
            ageGroup={ageGroup as string} 
            onFinish={handleQuizFinish}
            onGoBack={() => setAppStage('age-selection')}
          />
        );
        
      case 'quiz-results':
        return (
          <div className="quiz-results-screen">
            <h2>Quiz Completed!</h2>
            <div className="results-summary">
              <p className="score-text">
                Your Score: <span className="score-highlight">{quizScore}</span> / {quizTotalPossible}
              </p>
              <p className="percentage-text">
                {Math.round((quizScore / quizTotalPossible) * 100)}%
              </p>
            </div>
            
            {userData.badges.filter(badge => badge.isNew).length > 0 && (
              <div className="new-badges-earned">
                <h3>New Badges Earned:</h3>
                <div className="badges-list">
                  {userData.badges.filter(badge => badge.isNew).map(badge => (
                    <div key={badge.id} className="badge-item">
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-name">{badge.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              {ultimateUnlocked && (
                <button 
                  className="ultimate-button"
                  onClick={startUltimateChallenge}
                >
                  Take the Ultimate Challenge!
                </button>
              )}
              
              <button 
                className="leaderboard-button"
                onClick={goToLeaderboard}
              >
                View Leaderboard
              </button>
              
              <button 
                className="badges-button"
                onClick={goToBadges}
              >
                View Your Badges
              </button>
              
              <button 
                className="share-button"
                onClick={goToShare}
              >
                Share Your Results
              </button>
              
              <button 
                className="home-button"
                onClick={goToHome}
              >
                Return to Home
              </button>
            </div>
          </div>
        );
        
      case 'ultimate-challenge':
        return (
          <UltimateChallenge 
            completedAgeGroups={[ageGroup as string]} 
            onFinish={handleUltimateFinish}
            onGoBack={() => setAppStage('quiz-results')}
          />
        );
        
      case 'ultimate-results':
        return (
          <div className="ultimate-results-screen">
            <h2>Ultimate Challenge Completed!</h2>
            <div className="results-summary">
              <p className="score-text">
                Your Score: <span className="score-highlight">{ultimateScore}</span> / {ultimateTotalPossible}
              </p>
              <p className="percentage-text">
                {Math.round((ultimateScore / ultimateTotalPossible) * 100)}%
              </p>
            </div>
            
            {earnedAchievements.length > 0 && (
              <div className="new-achievements-earned">
                <h3>Achievements Unlocked:</h3>
                <div className="achievements-list">
                  {earnedAchievements.map(achievement => (
                    <div key={achievement.id} className="achievement-item">
                      <span className="achievement-icon">{achievement.icon}</span>
                      <span className="achievement-name">{achievement.title}</span>
                      <p className="achievement-description">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                className="leaderboard-button"
                onClick={goToLeaderboard}
              >
                View Leaderboard
              </button>
              
              <button 
                className="badges-button"
                onClick={goToBadges}
              >
                View Your Badges
              </button>
              
              <button 
                className="share-button"
                onClick={goToShare}
              >
                Share Your Results
              </button>
              
              <button 
                className="home-button"
                onClick={goToHome}
              >
                Return to Home
              </button>
            </div>
          </div>
        );
        
      case 'leaderboard':
        return (
          <div className="leaderboard-screen">
            <Leaderboard 
              currentUserID={userData.id}
              ageGroup={userData.ageGroup as string}
            />
            
            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={() => quizCompleted ? setAppStage('quiz-results') : setAppStage('welcome')}
              >
                Back
              </button>
              
              <button 
                className="home-button"
                onClick={goToHome}
              >
                Home
              </button>
            </div>
          </div>
        );
        
      case 'badges':
        return (
          <div className="badges-screen">
            <BadgeDisplay 
              badges={userData.badges}
              showLocked={true}
              highlightNew={true}
            />
            
            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={() => quizCompleted ? setAppStage('quiz-results') : setAppStage('welcome')}
              >
                Back
              </button>
              
              <button 
                className="home-button"
                onClick={goToHome}
              >
                Home
              </button>
            </div>
          </div>
        );
        
      case 'share':
        return (
          <div className="share-screen">
            <ShareCard 
              username={userData.username}
              score={quizCompleted ? quizScore : ultimateScore}
              totalPossible={quizCompleted ? quizTotalPossible : ultimateTotalPossible}
              ageGroup={userData.ageGroup as string}
              badges={userData.badges.filter(b => b.unlocked).map(b => b.icon)}
              quizTheme={weeklyTheme}
              dateCompleted={new Date()}
            />
            
            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={() => {
                  if (appStage === 'ultimate-results') {
                    setAppStage('ultimate-results');
                  } else if (quizCompleted) {
                    setAppStage('quiz-results');
                  } else {
                    setAppStage('welcome');
                  }
                }}
              >
                Back
              </button>
              
              <button 
                className="home-button"
                onClick={goToHome}
              >
                Home
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="welcome-screen">
            <h2>Welcome to the Biodiversity Quiz Challenge!</h2>
            <button 
              className="primary-button" 
              onClick={() => setAppStage('age-selection')}
            >
              Start Your Adventure
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WARP: Generational Interactive Quiz</h1>
        <p>Exploring Biodiversity Across Generations</p>
      </header>
      
      <main className="App-main">
        {renderStage()}
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2025 WARP Interactive Quiz | Biodiversity Education Initiative</p>
      </footer>
    </div>
  );
}

export default App;

