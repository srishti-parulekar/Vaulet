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

  const getChallenges = () => {
    api
      .get("/api/challenges/all/")
      .then((res) => setChallenges(res.data))
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getChallenges();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {challenges.active_challenges.length > 0 ? (
        challenges.active_challenges.map((challenge) => (
          <Challenge
            challenge={challenge}
            key={challenge.id}
            onContributionSuccess={getChallenges}
          />
        ))
      ) : (
        <p className="text-white">No active challenges available at the moment.</p>
      )}
    </div>
  );
};

export default Challenges;
