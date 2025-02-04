import React from 'react';
import './Challenge.css'; // Assuming styles are needed

const Challenge = ({ challenge }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="challenge-container">
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>
      <p>
        <strong>Start Date:</strong> {formatDate(challenge.start_date)}
      </p>
      <p>
        <strong>End Date:</strong> {formatDate(challenge.end_date)}
      </p>
      <p>
        <strong>Target Amount:</strong> ₹{challenge.target_amount}
      </p>
      <p>
        <strong>Current Amount:</strong> ₹{challenge.current_amount}
      </p>
      <p>
        <strong>Participants:</strong> {challenge.participants.length}
      </p>
    </div>
  );
};

export default Challenge;
