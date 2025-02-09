import React, { useState } from "react";
import api from "../../api";

const Create = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target_amount, setTargetAmount] = useState(0);
  const [current_amount, setCurrentAmount] = useState(0);
    const [vault, setVault] = useState([]);
  
  const getVaults = () => {
    api
      .get("/api/vault/check/")
      .then((res) => setVault(res.data))
      .catch((err) => alert(err));
  };
  const createVault = (e) => {
    e.preventDefault();
    api
      .post("/api/vault/check/", {
        description,
        title,
        target_amount,
        current_amount,
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Vault created!");
          setTitle("");
          setDescription("");
          setTargetAmount(0);
          setCurrentAmount(0);
          getVaults();
        } else {
          alert("Failed to create vault!");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error occurred while creating the vault.");
      });
  };

  return (
    <div className="form-div">
      <form className="form-container" onSubmit={createVault}>
        <h1 className="hero-title--gradient" style={{fontSize: "2.5rem"}}>Create Vault</h1>
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-input"
          placeholder="Tell us about your goal here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="number"
          placeholder="Target Amount"
          value={target_amount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="number"
          placeholder="Current Amount"
          value={current_amount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          required
        />
        <button className="cta-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
  
};

export default Create;
