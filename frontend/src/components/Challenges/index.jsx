import React, { useEffect, useState } from "react";
import Challenge from "../Challenge";
import api from "../../api";
import "./Challenges.css";

const Challenges = () => {
  const [challenges, setChallenges] = useState({
    active_challenges: [],
    completed_challenges: [],
    expired_challenges: [],
  });

  useEffect(() => {
    getChallenges();
  }, []);

  const getChallenges = () => {
    api
      .get("/api/challenges/all/")
      .then((res) => setChallenges(res.data))
      .catch((err) => alert(err));
  };

  return (
    <div className="vault-section" style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <h2>Active Challenges</h2>
        <div style={{ display: "flex" }}>
          {challenges.active_challenges.length > 0 ? (
            challenges.active_challenges.map((challenge) => (
              <Challenge challenge={challenge} key={challenge.id} />
            ))
          ) : (
            <p>No active challenges available at the moment.</p>
          )}
        </div>
      </div>

      <div>
        <h2>Completed Challenges</h2>
        {challenges.completed_challenges.length > 0 ? (
          challenges.completed_challenges.map((challenge) => (
            <Challenge challenge={challenge} key={challenge.id} />
          ))
        ) : (
          <p>No completed challenges available at the moment.</p>
        )}
      </div>

      <div>
        <h2>Expired Challenges</h2>
        {challenges.expired_challenges.length > 0 ? (
          challenges.expired_challenges.map((challenge) => (
            <Challenge challenge={challenge} key={challenge.id} />
          ))
        ) : (
          <p>No expired challenges available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Challenges;
