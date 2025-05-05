import { useState, useEffect, useCallback } from 'react';
import { Question, Answer, getQuestionsByAgeGroup } from '../data/questions';
import './Quiz.css';

interface QuizProps {
  ageGroup: string;
  onFinish: (score: number, totalPossible: number) => void;
  onGoBack: () => void;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswerId: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  totalPoints: number;
  timeLeft: number;
  isQuizComplete: boolean;
}

const SECONDS_PER_QUESTION = 30;

const Quiz: React.FC<QuizProps> = ({ ageGroup, onFinish, onGoBack }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswerId: null,
    isAnswerSubmitted: false,
    score: 0,
    totalPoints: 0,
    timeLeft: SECONDS_PER_QUESTION,
    isQuizComplete: false,
  });

  // Effect to load questions when component mounts or age group changes
  useEffect(() => {
    const questions = getQuestionsByAgeGroup(ageGroup);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    
    setQuizState({
      ...quizState,
      questions,
      totalPoints,
      currentQuestionIndex: 0,
      selectedAnswerId: null,
      isAnswerSubmitted: false,
      score: 0,
      timeLeft: SECONDS_PER_QUESTION,
      isQuizComplete: false,
    });
  }, [ageGroup]);

  // Timer effect
  useEffect(() => {
    if (quizState.isQuizComplete || quizState.isAnswerSubmitted) {
      return; // Don't run timer if quiz is complete or answer is submitted
    }

    const timer = setInterval(() => {
      setQuizState((prevState) => {
        if (prevState.timeLeft <= 1) {
          clearInterval(timer);
          // Time's up - auto-submit with current selection (or null)
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
  }, [quizState.currentQuestionIndex, quizState.isAnswerSubmitted, quizState.isQuizComplete]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!quizState.isQuizComplete) {
      setQuizState((prevState) => ({
        ...prevState,
        timeLeft: SECONDS_PER_QUESTION,
      }));
    }
  }, [quizState.currentQuestionIndex, quizState.isQuizComplete]);

  const handleAnswerSelect = (answerId: string) => {
    if (quizState.isAnswerSubmitted) return; // Prevent changing answer after submission
    
    setQuizState({
      ...quizState,
      selectedAnswerId: answerId,
    });
  };

  const handleAnswerSubmit = useCallback(() => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const selectedAnswer = currentQuestion?.answers.find(
      (a) => a.id === quizState.selectedAnswerId
    );
    
    // Update score if the answer is correct
    const additionalPoints = selectedAnswer?.isCorrect ? currentQuestion.points : 0;
    
    setQuizState((prevState) => ({
      ...prevState,
      score: prevState.score + additionalPoints,
      isAnswerSubmitted: true,
    }));
  }, [quizState.currentQuestionIndex, quizState.questions, quizState.selectedAnswerId]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (quizState.timeLeft === 0 && !quizState.isAnswerSubmitted) {
      handleAnswerSubmit();
    }
  }, [quizState.timeLeft, quizState.isAnswerSubmitted, handleAnswerSubmit]);

  const handleNextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= quizState.questions.length) {
      // Quiz is complete
      setQuizState({
        ...quizState,
        isQuizComplete: true,
      });
      onFinish(quizState.score, quizState.totalPoints);
    } else {
      // Move to next question
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        selectedAnswerId: null,
        isAnswerSubmitted: false,
        timeLeft: SECONDS_PER_QUESTION,
      });
    }
  };

  // Get the current question
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  
  // Calculate progress percentage
  const progressPercentage = quizState.questions.length 
    ? ((quizState.currentQuestionIndex) / quizState.questions.length) * 100 
    : 0;

  if (!currentQuestion) {
    return <div className="quiz-loading">Loading questions...</div>;
  }

  if (quizState.isQuizComplete) {
    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <p>Your score: <span className="final-score">{quizState.score}</span> out of {quizState.totalPoints}</p>
          <p className="score-percentage">
            {Math.round((quizState.score / quizState.totalPoints) * 100)}%
          </p>
        </div>
        
        <div className="result-message">
          {quizState.score >= quizState.totalPoints * 0.8 ? (
            <p>Excellent! You're a biodiversity expert!</p>
          ) : quizState.score >= quizState.totalPoints * 0.6 ? (
            <p>Great job! You know a lot about biodiversity!</p>
          ) : quizState.score >= quizState.totalPoints * 0.4 ? (
            <p>Good effort! Keep learning about our natural world.</p>
          ) : (
            <p>Thanks for participating! There's always more to learn about biodiversity.</p>
          )}
        </div>
        
        <div className="quiz-actions">
          <button className="restart-button" onClick={onGoBack}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Find if the selected answer is correct (after submission)
  const selectedAnswer = currentQuestion.answers.find(a => a.id === quizState.selectedAnswerId);
  const isSelectedCorrect = selectedAnswer?.isCorrect || false;
  
  // Find the correct answer (for displaying after submission)
  const correctAnswer = currentQuestion.answers.find(a => a.isCorrect);

  return (
    <div className="quiz-container">
      {/* Progress bar */}
      <div className="quiz-progress-container">
        <div 
          className="quiz-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        >
        </div>
        <div className="quiz-progress-text">
          Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
        </div>
      </div>

      {/* Timer */}
      <div className="quiz-timer">
        <div 
          className={`timer-bar ${quizState.timeLeft < 10 ? 'timer-low' : ''}`}
          style={{ width: `${(quizState.timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        ></div>
        <div className="timer-text">{quizState.timeLeft}s</div>
      </div>

      {/* Question */}
      <div className="question-container">
        <h2 className="question-text">
          {currentQuestion.text}
        </h2>
        
        {/* Question image if available */}
        {currentQuestion.image && (
          <div className="question-image-container">
            <img 
              src={currentQuestion.image} 
              alt="Question visual" 
              className="question-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Difficulty badge */}
        <div className={`difficulty-badge difficulty-${currentQuestion.difficulty}`}>
          {currentQuestion.difficulty}
        </div>

        {/* Points value */}
        <div className="points-badge">
          {currentQuestion.points} points
        </div>
      </div>

      {/* Answer options */}
      <div className="answers-container">
        {currentQuestion.answers.map((answer) => (
          <div
            key={answer.id}
            className={`answer-option ${
              quizState.selectedAnswerId === answer.id ? 'selected' : ''
            } ${
              quizState.isAnswerSubmitted
                ? answer.isCorrect
                  ? 'correct'
                  : quizState.selectedAnswerId === answer.id
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswerSelect(answer.id)}
          >
            <span className="answer-text">{answer.text}</span>
            
            {/* Show check/cross icons after submission */}
            {quizState.isAnswerSubmitted && (
              <span className="answer-icon">
                {answer.isCorrect ? '✓' : quizState.selectedAnswerId === answer.id ? '✗' : ''}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Answer explanation (shown after submission) */}
      {quizState.isAnswerSubmitted && currentQuestion.explanation && (
        <div className="answer-explanation">
          <h3>Explanation:</h3>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="quiz-actions">
        {!quizState.isAnswerSubmitted ? (
          <button
            className="submit-button"
            onClick={handleAnswerSubmit}
            disabled={!quizState.selectedAnswerId}
          >
            Submit Answer
          </button>
        ) : (
          <button className="next-button" onClick={handleNextQuestion}>
            {quizState.currentQuestionIndex === quizState.questions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
        )}
        
        <button className="back-button" onClick={onGoBack}>
          Quit Quiz
        </button>
      </div>

      {/* Current score display */}
      <div className="current-score">
        Score: {quizState.score} / {quizState.totalPoints}
      </div>
    </div>
  );
};

export default Quiz;

