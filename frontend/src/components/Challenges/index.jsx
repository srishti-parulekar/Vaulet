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
    
    <>
        <div
          style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "1rem",
            justifyContent: "space-between"
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
      
      {/* <div
        className="account-balance"
        style={{
          border: "0.05rem solid #ffffff",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          gap: "1rem",
          width: "50%",
        }}
      > */}
      {/* Completed Challenges */}
      {/* <div>
    <h2 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
      Completed Challenges
    </h2>
    <div className="account-balance">
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
  </div> */}

      {/* Separator */}
      {/* <div
    style={{
      height: "0.05rem",
      backgroundColor: "#ffffff",
      width: "100%",
    }}
  ></div> */}

      {/* Expired Challenges */}
      {/* <div>
          <h2 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
            Expired Challenges
          </h2>
          <div className="account-balance">
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
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Challenges;
