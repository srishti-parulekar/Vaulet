import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import api from "../../api";
import "./Challenge.css";
import IconButton from "@mui/material/IconButton";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Line } from "react-chartjs-2";

const Challenge = ({ challenge, onContributionSuccess }) => {
  const [open, setOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [error, setError] = useState("");
  const formattedDate = new Date(challenge.created_at).toLocaleDateString(
    "en-US"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const labels = challenge.monthly_data?.map((item) => item.month) || [];
  const contributions = challenge.monthly_data?.map((item) => item.contribution) || [];
  console.log("Labels:", labels);
  console.log("Contributions:", contributions);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: parseFloat(challenge.target_amount), // Set maximum to target amount
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "white",
          font: {
            size: 12,
          },
          callback: (value) => `$${value}`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Contribution: $${context.parsed.y}`,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Contributions",
        data: contributions,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#4CAF50",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4CAF50",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };
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
    const remainingAmount = challenge.target_amount - challenge.current_amount;

    if (amount > remainingAmount) {
      setError(`Maximum allowed contribution is ₹${remainingAmount}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(
        `/api/challenges/${challenge.id}/contribute/`,
        {
          amount: parseFloat(contributionAmount),
        }
      );

      if (response.data) {
        handleClose();
        onContributionSuccess();
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
      const response = await api.put(`/api/challenges/${challenge.id}/redeem/`);
      if (response.data) {
        onContributionSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to redeem challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isCompleted = challenge.current_amount >= challenge.target_amount;
  const progress = (challenge.current_amount / challenge.target_amount) * 100;

  return (
    <div style={{ 
      width: "48%", 
      minWidth: "300px",
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "1rem",
      padding: "1.5rem",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      marginBottom: "1rem"
  }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          {challenge.title}
        </h3>
        <IconButton
          onClick={() => onDelete(challenge.id)}
          sx={{
            color: "white",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <MdOutlineDeleteOutline />
        </IconButton>
      </div>

      <p
        style={{
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "1.5rem",
        }}
      >
        {challenge.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p style={{ margin: "0.5rem 0", color: "rgba(255, 255, 255, 0.7)" }}>
            Target Amount
          </p>
          <p style={{ margin: 0, fontSize: "1.25rem" }}>
            ${challenge.target_amount}
          </p>
        </div>
        <div>
          <p style={{ margin: "0.5rem 0", color: "rgba(255, 255, 255, 0.7)" }}>
            Current Amount
          </p>
          <p style={{ margin: 0, fontSize: "1.25rem" }}>
            ${challenge.current_amount}
          </p>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "6px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#4CAF50",
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          height: "200px",
          marginBottom: "1.5rem",
        }}
      >
        <Line data={chartData} options={chartOptions} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.875rem",
          }}
        >
          Created on: {formattedDate}
        </p>

        {isCompleted && !challenge.is_redeemed ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
            onClick={handleRedeem}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redeeming..." : "Redeem"}
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
            onClick={handleOpen}
            disabled={isSubmitting || challenge.is_redeemed}
          >
            {challenge.is_redeemed ? "Redeemed" : "Contribute"}
          </Button>
        )}
      </div>

      

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="hero-title--gradient">
          {challenge.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remaining amount to reach target: ₹
            {challenge.target_amount - challenge.current_amount}
          </DialogContentText>
          <form onSubmit={handleContributionSubmit} style={formStyle}>
            <TextField
              label="Contribution Amount (₹)"
              fullWidth
              type="number"
              variant="outlined"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              required
              error={!!error}
              helperText={error}
              disabled={isSubmitting}
            />
            <button
              variant="contained"
              type="submit"
              onClick={handleContributionSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Contributing..." : "Save"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
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

export default Challenge;
