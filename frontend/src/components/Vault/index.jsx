import React, { useState } from "react";
import "./Vault.css";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import api from "../../api";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

function Vault({ vault, onDelete, onUpdate }) {
  const formattedDate = new Date(vault.created_at).toLocaleDateString("en-US");
  const [open, setOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setContributionAmount("");
    setError("");
  };

  const handleContributionChange = (event) => {
    setContributionAmount(event.target.value);
    setError("");
  };

  const handleContributionSubmit = async (event) => {
    event.preventDefault();
    
    if (!contributionAmount || isNaN(contributionAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    const amount = parseFloat(contributionAmount);
    const remainingAmount = vault.target_amount - vault.current_amount;

    if (amount > remainingAmount) {
      setError(`Maximum allowed contribution is ₹${remainingAmount}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(`/api/vault/${vault.id}/contribute/`, {
        amount: parseFloat(contributionAmount)
      });

      if (response.data) {
        handleClose();
        onUpdate(); // Call the parent's update function
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to make contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedeem = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.put(`/api/vault/${vault.id}/redeem/`);
      if (response.data) {
        onUpdate(); // Call the parent's update function
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to redeem vault");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompleted = vault.current_amount >= vault.target_amount;

  return (
<div className="account-balance" style={{ border: "0.05rem solid #ffffff", padding: "0.75rem", borderRadius: "0.5rem" }}>
<div style={{ display: "flex", justifyContent: "space-between" }}>
        <p className="vault-title" style={{ paddingTop: "0.2rem" }}>{vault.title}</p>
        <button style={{ fontSize: "1.5rem", background: "none" }} onClick={() => onDelete(vault.id)}>
          <MdOutlineDeleteOutline />
        </button>
      </div>
      <p className="vault-description">{vault.description}</p>
      <div className="vault-amounts">
        <p className="vault-target-amount">
          Target Amount: ${vault.target_amount}
        </p>
        <p className="vault-current-amount">
          Current Amount: ${vault.current_amount}
        </p>
      </div>
      <p className="vault-date">Created on: {formattedDate}</p>
      <div className="line-chart">
        
      </div>
      {isCompleted && !vault.is_redeemed ? (
  <Button
    variant="contained"
    color="success"
    onClick={handleRedeem}
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Redeeming...' : 'Redeem'}
  </Button>
) : (
  <Button
    variant="contained"
    style={{ backgroundColor: "rgb(60, 72, 21)" }}
    onClick={handleOpen}
    disabled={isSubmitting || vault.is_redeemed}
  >
    {vault.is_redeemed ? 'Redeemed' : 'Contribute'}
  </Button>
)}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="hero-title--gradient">{vault.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remaining amount to reach target: ₹{vault.target_amount - vault.current_amount}
          </DialogContentText>
          <form onSubmit={handleContributionSubmit} style={formStyle}>
            <TextField
              label="Contribution Amount (₹)"
              fullWidth
              type="number"
              variant="outlined"
              value={contributionAmount}
              onChange={handleContributionChange}
              required
              error={!!error}
              helperText={error}
              disabled={isSubmitting}
            />
            <button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Contributing...' : 'Save'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const formStyle = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "10px",
};

export default Vault;