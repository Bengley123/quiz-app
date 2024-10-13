import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, incorrectAnswers, totalQuestions } = location.state || {
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalQuestions: 0,
  };

  const handlePlayAgain = () => {
    localStorage.removeItem('quizData');
    navigate('/quiz');
  };

  const handleback = () => {
    navigate('/');
  }

  return (
    <div id="results">
      <div className="results-container">
        <h2>Quiz Results</h2>
        <p>Total Questions: <span className="result-data">{totalQuestions}</span></p>
        <p>Correct Answers: <span className="result-data">{correctAnswers}</span></p>
        <p>Incorrect Answers: <span className="result-data">{incorrectAnswers}</span></p>
        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={handleback}>Back Home</button>
      </div>
    </div>
  );
};

export default Results;
