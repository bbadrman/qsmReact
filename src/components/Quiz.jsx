import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Quiz.css";
import allQuestions from "../data/questions";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Quiz = ({ onFinish, numQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const selectedQs = shuffleArray(allQuestions)
      .slice(0, numQuestions)
      .map((q) => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    setQuestions(selectedQs);
    setCurrent(0);
    setScore(0);
    setSelectedOption(null);
    setValidated(false);
  }, [numQuestions]);

  const handleOptionClick = (option) => {
    if (validated) return;
    setSelectedOption(option);
  };

  const handleValidate = () => {
    if (!selectedOption) return;

    if (selectedOption === questions[current].answer) {
      setScore((prev) => prev + 1);
    }
    setValidated(true);
  };

  const handleNext = () => {
    setValidated(false);
    setSelectedOption(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      onFinish(score);
    }
  };

  const getOptionClassName = (option) => {
    let className = "option";
    if (validated) {
      if (option === questions[current].answer) {
        className += " correct";
      } else if (option === selectedOption) {
        className += " wrong";
      } else {
        className += " disabled";
      }
    } else if (selectedOption === option) {
      className += " selected";
    }
    return className;
  };

  if (questions.length === 0) return <p>Chargement des questions...</p>;

  const progressPercent = ((current + 1) / questions.length) * 100;

  return (
    <div className="quiz" role="main" aria-label="Quiz">
      {/* Top bar avec KPIs */}
      <div className="quiz-top">
        <span className="kpi">Question {current + 1} / {questions.length}</span>
        <span className="kpi">Score: {score}</span>
      </div>

      {/* Barre de progression */}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label={`Progression: question ${current + 1} sur ${questions.length}`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question */}
          <h2 className="question">{questions[current].question}</h2>

          {/* Options */}
          <div
            className="options"
            role="radiogroup"
            aria-label="Options de réponse"
          >
            {questions[current].options.map((option, idx) => (
              <button
                key={idx}
                className={getOptionClassName(option)}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOptionClick(option);
                  }
                }}
                role="radio"
                aria-checked={selectedOption === option}
                aria-disabled={validated}
                disabled={validated && option !== questions[current].answer && option !== selectedOption}
              >
                <span className="option-dot" aria-hidden="true" />
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Hint */}
      {!validated && !selectedOption && (
        <p className="hint">Sélectionne une réponse puis valide.</p>
      )}

      {/* Actions */}
      <div className="quiz-actions">
        {!validated ? (
          <button
            className="btn"
            disabled={!selectedOption}
            onClick={handleValidate}
            aria-label="Valider la réponse"
          >
            Valider
          </button>
        ) : (
          <button
            className="btn"
            onClick={handleNext}
            aria-label={current + 1 === questions.length ? "Voir le résultat" : "Question suivante"}
          >
            {current + 1 === questions.length ? "Voir le résultat" : "Suivant"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
