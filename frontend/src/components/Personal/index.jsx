import React, { useState, useEffect } from "react";
import Card from "../Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import api from "../../api";
import "./Personal.css"
import Transactions from "../Transactions";
// import award from "../../assets/award.png";
// import award2 from "../../assets/award2.png";
// import award3 from "../../assets/award3.png";
// import award4 from "../../assets/award4.png";
// import award5 from "../../assets/award5.png";
import award6 from "../../assets/award6.png";
import award7 from "../../assets/award7.png";
import award8 from "../../assets/award8.png";

const Personal = () => {

  const [openContributionPopup, setOpenContributionPopup] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [state, setState] = useState({
    balance: "",
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const handleOpenContributionPopup = () => {
    setOpenContributionPopup(true);
  };

  const handleCloseContributionPopup = () => {
    setOpenContributionPopup(false);
  };

  const handleContributionSubmit = async (event) => {
    event.preventDefault();
    try {
      // Calculate the new balance
      const updatedBalance =
        parseFloat(state.balance) + parseFloat(contributionAmount);

      const res = await api.put("/api/personal-vault/update/", {
        balance: updatedBalance,
        number: state.number,
        name: state.name,
        expiry: state.expiry,
        cvc: state.cvc,
      });

      setState((prev) => ({
        ...prev,
        balance: res.data.balance || updatedBalance,
      }));

      alert(`Contributed $${contributionAmount} to your personal vault.`);
      setOpenContributionPopup(false);
      setContributionAmount("");
    } catch (error) {
      console.error("Failed to update personal vault balance: ", error);
      alert("Error updating card details.");
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/personal-vault/detail/");
        const { balance, number, name, expiry, cvc } = res.data;

        setState({
          balance: balance,
          number: number || "",
          name: name || "",
          expiry: expiry || "",
          cvc: cvc || "",
        });
      } catch (error) {
        console.error("Failed to fetch balance: ", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="account-balance-container" style={{padding: "0rem"}}>
      <section >
        <h3 className="hero-title--gradient" style={{ fontSize: "2rem" }}>
          My Personal Vault
        </h3>
        <div className="account-balance" style={{ border: "0.05rem solid #ffffff", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem",
          display: "flex", flexDirection: "column"
        }}>
          <h4>Total Balance</h4>
          <p>${state.balance}</p>
        <div style={{display: "flex"}}>
          <img src={award6}/>
          <img src={award7}/>
          <img src={award8}/>
          </div>
          <Button
            variant="contained"
            onClick={handleOpenContributionPopup}
            sx={{
              backgroundColor: "rgb(91, 112, 87)", // Default shade of green
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgb(75, 111, 68)", // Slightly darker green on hover
              },
              marginInlineRight: "2rem",
              marginTop: "1rem"
            }}
          >
            Contribute to Personal Vault
          </Button>
        </div>

        {/* Contribution Popup */}
        <Dialog
          open={openContributionPopup}
          onClose={handleCloseContributionPopup}
        >
          <DialogTitle className="hero-title--gradient">Contribute to Personal Vault</DialogTitle>
          <DialogContent>
            <form onSubmit={handleContributionSubmit} style={formStyle}>
              <TextField
                label="Enter Amount in Rupees"
                fullWidth
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
              />
              <button variant="contained" type="submit">
              Save
            </button>
            </form>
          </DialogContent>
        </Dialog>

        <section className="account-balance" style={{paddingLeft: "0rem"}}>
        <Card />
        </section>
      </section>

      {/* Popup for Card Update */}
            <div><Transactions/></div>
    </div>
  );
};


const formStyle = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "10px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  width: "100%",
};

export default Personal;
