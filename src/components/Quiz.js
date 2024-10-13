import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './_quiz.scss'; // Pastikan untuk mengimpor stylesheet ini

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuizData = localStorage.getItem('quizData');
    if (savedQuizData) {
      const { savedQuestions, savedCurrentQuestion, savedCorrectAnswers, savedIncorrectAnswers } = JSON.parse(savedQuizData);
      setQuestions(savedQuestions);
      setCurrentQuestion(savedCurrentQuestion);
      setCorrectAnswers(savedCorrectAnswers);
      setIncorrectAnswers(savedIncorrectAnswers);
    } else {
      axios.get('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(response => {
          setQuestions(response.data.results);
        });
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleFinishQuiz();
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (questions.length > 0) {
      const quizData = {
        savedQuestions: questions,
        savedCurrentQuestion: currentQuestion,
        savedCorrectAnswers: correctAnswers,
        savedIncorrectAnswers: incorrectAnswers,
      };
      localStorage.setItem('quizData', JSON.stringify(quizData));
    }
  }, [questions, currentQuestion, correctAnswers, incorrectAnswers]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    navigate('/result', {
      state: {
        correctAnswers,
        incorrectAnswers,
        totalQuestions: questions.length,
      },
    });
    localStorage.removeItem('quizData');
  };

  if (questions.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div id="quiz">
      <h2>Time Left: {timeLeft}s</h2>
      <div>
        <h3>{questions[currentQuestion].question}</h3>
        <div className="answers">
          {questions[currentQuestion].incorrect_answers.map((answer, index) => (
            <button key={index} onClick={() => handleAnswer(false)}>
              {answer}
            </button>
          ))}
          <button onClick={() => handleAnswer(true)}>
            {questions[currentQuestion].correct_answer}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
