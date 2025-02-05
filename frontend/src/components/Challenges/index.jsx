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
    <div
      className="account-balance-container"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div className="account-balance">
        <h2 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
          Active Challenges
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(166, 200, 159, 0.19)",
            justifyContent: "center"
          }}
          className="account-balance"
        >
          {challenges.active_challenges.length > 0 ? (
            challenges.active_challenges.map((challenge) => (
              <Challenge 
                challenge={challenge} 
                key={challenge.id} 
                onContributionSuccess={getChallenges}
              />
            ))
          ) : (
            <p>No active challenges available at the moment.</p>
          )}
        </div>
      </div>

      <div className="account-balance" style={{justifyItems: "center"}}>
        <div style={{marginBottom: "2rem"}}>
          <h2 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
            Completed Challenges
          </h2>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(34, 117, 18, 0.19)",
            }}
            className="account-balance"
          >
            {challenges.completed_challenges.length > 0 ? (
              challenges.completed_challenges.map((challenge) => (
                <Challenge 
                  challenge={challenge} 
                  key={challenge.id}
                  onContributionSuccess={getChallenges}
                />
              ))
            ) : (
              <p>No completed challenges available at the moment.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
            Expired Challenges
          </h2>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(34, 117, 18, 0.19)",
            }}
            className="account-balance"
          >
            {challenges.expired_challenges.length > 0 ? (
              challenges.expired_challenges.map((challenge) => (
                <Challenge 
                  challenge={challenge} 
                  key={challenge.id}
                  onContributionSuccess={getChallenges}
                />
              ))
            ) : (
              <p>No expired challenges available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
