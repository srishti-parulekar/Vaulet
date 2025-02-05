import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import api from "../../api";
import "./Challenge.css";

const Challenge = ({ challenge }) => {
  const [open, setOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [error, setError] = useState("");

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

    try {
      const response = await api.put(`/api/challenges/${challenge.id}/contribute/`, {
        amount: parseFloat(contributionAmount)
      });

      // Update the parent component with new challenge data
      if (response.data) {
        // You might want to trigger a refresh of the challenges list here
        console.log("Contribution successful:", response.data);
      }
      
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to make contribution");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="challenge-card">
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      <div className="challenge-details">
        <p>Start Date: {formatDate(challenge.start_date)}</p>
        <p>End Date: {formatDate(challenge.end_date)}</p>
        <p>Target Amount: ₹{challenge.target_amount}</p>
        <p>Current Amount: ₹{challenge.current_amount}</p>
        <p>Participants: {challenge.participants.length}</p>
      </div>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
      >
        Contribute
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{challenge.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {challenge.description}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Contribution Amount (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={contributionAmount}
            onChange={handleContributionChange}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleContributionSubmit} color="primary" variant="contained">
            Contribute
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Challenge;