import { useState, useEffect, useCallback } from 'react';
import { Question, Answer, questionSets } from '../data/questions';
import './UltimateChallenge.css';

interface UltimateChallengeProps {
  completedAgeGroups: string[];
  onFinish: (score: number, totalPossible: number, achievements: Achievement[]) => void;
  onGoBack: () => void;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface UltimateChallengeState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  totalPoints: number;
  timeLeft: number;
  isQuizComplete: boolean;
  streak: number;
  maxStreak: number;
  fastAnswers: number;
  achievements: Achievement[];
  timeBonus: number;
}

// Constants for the Ultimate Challenge
const SECONDS_PER_QUESTION = 45;
const FAST_ANSWER_THRESHOLD = 15; // Seconds left is considered fast
const TIME_BONUS_FACTOR = 0.5; // Bonus points as a factor of question points
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ultimate_complete',
    title: 'Ultimate Champion',
    description: 'Completed the Ultimate Challenge',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Flawless Victory',
    description: 'Achieved a perfect score on the Ultimate Challenge',
    icon: '✨',
    unlocked: false
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Answered 5 questions correctly in a row',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answered 3 questions quickly and correctly',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'diversity_expert',
    title: 'Biodiversity Expert',
    description: 'Correctly answered questions from all difficulty levels',
    icon: '🌿',
    unlocked: false
  }
];

/**
 * UltimateChallenge component represents the final level of the quiz
 * with mixed questions from all age groups and enhanced scoring.
 */
const UltimateChallenge: React.FC<UltimateChallengeProps> = ({
  completedAgeGroups,
  onFinish,
  onGoBack
}) => {
  const [challengeState, setChallengeState] = useState<UltimateChallengeState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswerId: null,
    isAnswerSubmitted: false,
    score: 0,
    totalPoints: 0,
    timeLeft: SECONDS_PER_QUESTION,
    isQuizComplete: false,
    streak: 0,
    maxStreak: 0,
    fastAnswers: 0,
    achievements: [...ACHIEVEMENTS],
    timeBonus: 0
  });

  // Load questions when component mounts
  useEffect(() => {
    // Get questions from all completed age groups
    const allQuestions: Question[] = [];
    let uniqueIds = new Set<string>();
    
    // Add questions from all completed age groups
    completedAgeGroups.forEach(ageGroup => {
      if (questionSets[ageGroup]) {
        const groupQuestions = questionSets[ageGroup].questions;
        
        // Filter out duplicate questions
        groupQuestions.forEach(question => {
          if (!uniqueIds.has(question.id)) {
            allQuestions.push(question);
            uniqueIds.add(question.id);
          }
        });
      }
    });
    
    // Shuffle and limit to 10 questions
    const shuffledQuestions = allQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    
    // Calculate total points
    const totalPoints = shuffledQuestions.reduce((sum, q) => {
      // In Ultimate Challenge, questions are worth 1.5x their original value
      return sum + Math.round(q.points * 1.5);
    }, 0);
    
    setChallengeState(prev => ({
      ...prev,
      questions: shuffledQuestions,
      totalPoints
    }));
  }, [completedAgeGroups]);

  // Timer effect
  useEffect(() => {
    if (challengeState.isQuizComplete || challengeState.isAnswerSubmitted) {
      return; // Don't run timer if quiz is complete or answer is submitted
    }

    const timer = setInterval(() => {
      setChallengeState(prevState => {
        if (prevState.timeLeft <= 1) {
          clearInterval(timer);
          // Time's up - auto-submit with current selection
          return {
            ...prevState,
            timeLeft: 0,
            isAnswerSubmitted: true,
          };
        }
        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeState.currentQuestionIndex, challengeState.isAnswerSubmitted, challengeState.isQuizComplete]);

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    if (challengeState.isAnswerSubmitted) return;
    
    setChallengeState(prev => ({
      ...prev,
      selectedAnswerId: answerId
    }));
  };

  // Handle answer submission
  const handleAnswerSubmit = useCallback(() => {
    const currentQuestion = challengeState.questions[challengeState.currentQuestionIndex];
    if (!currentQuestion) return;

    const selectedAnswer = currentQuestion.answers.find(
      a => a.id === challengeState.selectedAnswerId
    );
    
    // Calculate base points and time bonus
    const isCorrect = selectedAnswer?.isCorrect || false;
    const basePoints = isCorrect ? Math.round(currentQuestion.points * 1.5) : 0;
    
    // Calculate time bonus for fast correct answers
    const timeBonus = isCorrect && challengeState.timeLeft > FAST_ANSWER_THRESHOLD 
      ? Math.round(currentQuestion.points * TIME_BONUS_FACTOR)
      : 0;
    
    // Update the state with new score and streaks
    setChallengeState(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newMaxStreak = Math.max(newStreak, prev.maxStreak);
      const newFastAnswers = isCorrect && challengeState.timeLeft > FAST_ANSWER_THRESHOLD 
        ? prev.fastAnswers + 1 
        : prev.fastAnswers;
      
      // Check for and update achievements
      const updatedAchievements = [...prev.achievements];
      
      // Streak Master achievement
      if (newStreak >= 5) {
        const streakAchievement = updatedAchievements.find(a => a.id === 'streak_master');
        if (streakAchievement && !streakAchievement.unlocked) {
          streakAchievement.unlocked = true;
        }
      }
      
      // Speed Demon achievement
      if (newFastAnswers >= 3) {
        const speedAchievement = updatedAchievements.find(a => a.id === 'speed_demon');
        if (speedAchievement && !speedAchievement.unlocked) {
          speedAchievement.unlocked = true;
        }
      }
      
      return {
        ...prev,
        score: prev.score + basePoints + timeBonus,
        isAnswerSubmitted: true,
        streak: newStreak,
        maxStreak: newMaxStreak,
        fastAnswers: newFastAnswers,
        achievements: updatedAchievements,
        timeBonus: prev.timeBonus + timeBonus
      };
    });
  }, [challengeState.currentQuestionIndex, challengeState.questions, challengeState.selectedAnswerId, challengeState.timeLeft]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (challengeState.timeLeft === 0 && !challengeState.isAnswerSubmitted) {
      handleAnswerSubmit();
    }
  }, [challengeState.timeLeft, challengeState.isAnswerSubmitted, handleAnswerSubmit]);

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    const nextIndex = challengeState.currentQuestionIndex + 1;
    
    if (nextIndex >= challengeState.questions.length) {
      // Check for completion achievements
      const updatedAchievements = [...challengeState.achievements];
      
      // Ultimate Champion achievement
      const ultimateAchievement = updatedAchievements.find(a => a.id === 'ultimate_complete');
      if (ultimateAchievement) {
        ultimateAchievement.unlocked = true;
      }
      
      // Perfect Score achievement
      const perfectScoreAchievement = updatedAchievements.find(a => a.id === 'perfect_score');
      if (perfectScoreAchievement && challengeState.score === challengeState.totalPoints) {
        perfectScoreAchievement.unlocked = true;
      }
      
      // Update diversity expert achievement
      // This checks if player correctly answered questions from all difficulty levels
      const answeredDifficulties = new Set<string>();
      challengeState.questions.forEach((q, index) => {
        const selectedAnswerId = challengeState.questions[index].answers.find(a => a.isCorrect)?.id;
        if (selectedAnswerId) {
          answeredDifficulties.add(q.difficulty);
        }
      });
      
      if (answeredDifficulties.size >= 3) {
        const diversityAchievement = updatedAchievements.find(a => a.id === 'diversity_expert');
        if (diversityAchievement) {
          diversityAchievement.unlocked = true;
        }
      }
      
      // Complete quiz
      setChallengeState(prev => ({
        ...prev,
        isQuizComplete: true,
        achievements: updatedAchievements
      }));
      
      // Send results to parent component
      onFinish(
        challengeState.score, 
        challengeState.totalPoints, 
        updatedAchievements.filter(a => a.unlocked)
      );
    } else {
      // Move to next question
      setChallengeState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswerId: null,
        isAnswerSubmitted: false,
        timeLeft: SECONDS_PER_QUESTION
      }));
    }
  };

  // Get current question
  const currentQuestion = challengeState.questions[challengeState.currentQuestionIndex];
  
  // Calculate progress percentage
  const progressPercentage = challengeState.questions.length 
    ? ((challengeState.currentQuestionIndex) / challengeState.questions.length) * 100 
    : 0;

  if (!currentQuestion) {
    return (
      <div className="ultimate-loading">
        <div className="ultimate-loading-spinner"></div>
        <h2>Preparing Your Ultimate Challenge...</h2>
        <p>Get ready for questions from all age groups!</p>
      </div>
    );
  }

  if (challengeState.isQuizComplete) {
    const unlockedAchievements = challengeState.achievements.filter(a => a.unlocked);
    
    return (
      <div className="ultimate-results">
        <h2>Ultimate Challenge Complete!</h2>
        
        <div className="ultimate-score-display">
          <p>Your score: <span className="ultimate-final-score">{challengeState.score}</span> out of {challengeState.totalPoints}</p>
          <p className="ultimate-score-percentage">
            {Math.round((challengeState.score / challengeState.totalPoints) * 100)}%
          </p>
          
          {challengeState.timeBonus > 0 && (
            <p className="ultimate-time-bonus">Time Bonus Points: +{challengeState.timeBonus}</p>
          )}
        </div>
        
        {unlockedAchievements.length > 0 && (
          <div className="achievements-section">
            <h3>Achievements Unlocked</h3>
            <div className="achievements-grid">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="ultimate-result-message">
          {challengeState.score >= challengeState.totalPoints * 0.9 ? (
            <p>Incredible! You're a true biodiversity champion!</p>
          ) : challengeState.score >= challengeState.totalPoints * 0.7 ? (
            <p>Outstanding performance! Your knowledge of biodiversity is impressive!</p>
          ) : challengeState.score >= challengeState.totalPoints * 0.5 ? (
            <p>Great job tackling the Ultimate Challenge! You've shown good biodiversity knowledge.</p>
          ) : (
            <p>You've completed the Ultimate Challenge! Keep exploring the wonderful world of biodiversity.</p>
          )}
        </div>
        
        <div className="ultimate-actions">
          <button className="ultimate-restart-button" onClick={onGoBack}>
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  // Find selected answer and if it's correct
  const selectedAnswer = currentQuestion.answers.find(a => a.id === challengeState.selectedAnswerId);
  const isSelectedCorrect = selectedAnswer?.isCorrect || false;
  
  // Find the correct answer
  const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);

  return (
    <div className="ultimate-container">
      <div className="ultimate-header">
        <h1>Ultimate Challenge</h1>
        <p className="ultimate-subtitle">Test your knowledge across all age groups!</p>
      </div>
      
      {/* Progress bar */}
      <div className="ultimate-progress-container">
        <div 
          className="ultimate-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
        </div>
        <div className="ultimate-progress-text">
          Question {challengeState.currentQuestionIndex + 1} of {challengeState.questions.length}
        </div>
      </div>

      {/* Timer */}
      <div className="ultimate-timer">
        <div 
          className={`ultimate-timer-bar ${challengeState.timeLeft < 10 ? 'ultimate-timer-low' : ''}`}
          style={{ width: `${(challengeState.timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        ></div>
        <div className="ultimate-timer-text">
          {challengeState.timeLeft}s
          {challengeState.timeLeft > FAST_ANSWER_THRESHOLD && (
            <span className="fast-answer-indicator"> ⚡ Speed bonus active!</span>
          )}
        </div>
      </div>

      {/* Streaks and bonuses */}
      <div className="ultimate-stats">
        <div className="ultimate-streak">
          <span className="streak-icon">🔥</span> Streak: {challengeState.streak}
        </div>
        {challengeState.timeBonus > 0 && (
          <div className="ultimate-bonus">
            <span className="bonus-icon">⏱️</span> Time Bonus: +{challengeState.timeBonus}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="ultimate-question-container">
        <h2 className="ultimate-question-text">
          {currentQuestion.text}
        </h2>
        
        {/* Question image if available */}
        {currentQuestion.image && (
          <div className="ultimate-question-image-container">
            <img 
              src={currentQuestion.image} 
              alt="Question visual" 
              className="ultimate-question-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Difficulty badge */}
        <div className={`ultimate-difficulty-badge ultimate-difficulty-${currentQuestion.difficulty}`}>
          {currentQuestion.difficulty}
        </div>

        {/* Points value */}
        <div className="ultimate-points-badge">
          {Math.round(currentQuestion.points * 1.5)} points
        </div>
      </div>

      {/* Answer options */}
      <div className="ultimate-answers-container">
        {currentQuestion.answers.map((answer) => (
          <div
            key={answer.id}
            className={`ultimate-answer-option ${
              challengeState.selectedAnswerId === answer.id ? 'selected' : ''
            } ${
              challengeState.isAnswerSubmitted
                ? answer.isCorrect
                  ? 'correct'
                  : challengeState.selectedAnswerId === answer.id
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswerSelect(answer.id)}
          >
            <span className="ultimate-answer-text">{answer.text}</span>
            
            {/* Show check/cross icons after submission */}
            {challengeState.isAnswerSubmitted && (
              <span className="ultimate-answer-icon">
                {answer.isCorrect ? '✓' : challengeState.selectedAnswerId === answer.id ? '✗' : ''}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Answer explanation (shown after submission) */}
      {challengeState.isAnswerSubmitted && currentQuestion.explanation && (
        <div className="ultimate-answer-explanation">
          <h3>Explanation:</h3>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="ultimate-actions">
        {!challengeState.isAnswerSubmitted ? (
          <button
            className="ultimate-submit-button"
            onClick={handleAnswerSubmit}
            disabled={!challengeState.selectedAnswerId}
          >
            Submit Answer
          </button>
        ) : (
          <button className="ultimate-next-button" onClick={handleNextQuestion}>
            {challengeState.currentQuestionIndex === challengeState.questions.length - 1
              ? 'Complete Challenge'
              : 'Next Question'}
          </button>
        )}
        
        <button className="ultimate-back-button" onClick={onGoBack}>
          Quit Challenge
        </button>
      </div>

      {/* Current score display */}
      <div className="ultimate-current-score">
        Score: {challengeState.score} / {challengeState.totalPoints}
      </div>
      
      {/* Unlocked achievements indicator */}
      {challengeState.achievements.some(a => a.unlocked) && (
        <div className="ultimate-achievements-indicator">
          <span className="achievements-icon">🏆</span>
          {challengeState.achievements.filter(a => a.unlocked).length} Achievement(s) Unlocked!
        </div>
      )}
    </div>
  );

