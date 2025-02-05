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

const Challenge = ({ challenge, onContributionSuccess }) => {
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

    setIsSubmitting(true);
    try {
      const response = await api.put(`/api/challenges/${challenge.id}/contribute/`, {
        amount: parseFloat(contributionAmount)
      });

      if (response.data) {
        handleClose();
        // Call the parent's refresh function
        onContributionSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to make contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="challenge-card">
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      
      
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
            <div className="challenge-details">
        <p>Start Date: {formatDate(challenge.start_date)}</p>
        <p>End Date: {formatDate(challenge.end_date)}</p>
        <p>Target Amount: ₹{challenge.target_amount}</p>
        <p>Current Amount: ₹{challenge.current_amount}</p>
        <p>Participants: {challenge.participants.length}</p>
      </div>
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
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleContributionSubmit} 
            color="primary" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Contributing...' : 'Contribute'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Challenge;