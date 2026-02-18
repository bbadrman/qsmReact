import React from "react";
import "./Result.css";

const Result = ({ username, score, totalQuestions, onRestart }) => {
  const percentage = (score / totalQuestions) * 100;

  let message = "";
  let messageClass = "";

  if (percentage >= 80) {
    message = "Bravo, excellent travail !";
    messageClass = "excellent";
  } else if (percentage >= 50) {
    message = "Pas mal, continue à t'entraîner.";
    messageClass = "good";
  } else {
    message = "Il faut persévérer, ne lâche rien !";
    messageClass = "retry";
  }

  return (
    <div className="result" role="main" aria-label="Résultat du quiz">
      <h2>Résultat de {username}</h2>
      <p className="score">{score} / {totalQuestions}</p>
      <p className="score-label">{Math.round(percentage)}% de bonnes réponses</p>
      <p className={`message ${messageClass}`}>{message}</p>
      <button
        className="restart-btn"
        onClick={onRestart}
        aria-label="Recommencer le quiz"
      >
        Recommencer
      </button>
    </div>
  );
};

export default Result;
