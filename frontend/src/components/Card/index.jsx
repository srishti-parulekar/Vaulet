import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import api from "../../api";

const Card = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCardPopup, setOpenCardPopup] = useState(false);

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  // Fetch card details from the backend
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const res = await api.get("/api/personal-vault/detail/");
        const { number, name, expiry, cvc } = res.data;

        setState({
          number: number || "",
          name: name || "",
          expiry: expiry || "",
          cvc: cvc || "",
          focus: "",
        });
      } catch (error) {
        console.error("Failed to fetch card details:", error);
      }
    };

    fetchCardDetails();
  }, []);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const res = await api.put("/api/personal-vault/update/", {
        number: state.number,
        name: state.name,
        expiry: state.expiry,
        cvc: state.cvc,
      });

      setState((prev) => ({
        ...prev,
        number: res.data.number || prev.number,
        name: res.data.name || prev.name,
        expiry: res.data.expiry || prev.expiry,
        cvc: res.data.cvc || prev.cvc,
      }));
      alert("Card details updated successfully!");
      setOpenCardPopup(false);

      if (location.pathname === "/carddetails") {
        // If on "/carddetails", navigate to "/home"
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to update card details:", error);
      alert("Error updating card details.");
    }
  };

  const handleOpenCardPopup = () => {
    setOpenCardPopup(true);
  };

  const handleCloseCardPopup = () => {
    setOpenCardPopup(false);
  };

  return (
    <div className="payment-form-container" style={containerStyle}>
      <div className="left-card">
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />

        <Dialog open={openCardPopup} onClose={handleCloseCardPopup}>
          <DialogTitle className="hero-title--gradient">
            Edit Your Secure Card Details
          </DialogTitle>
          <DialogContent>
            <form style={formStyle} onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Cardholder Name"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                style={inputStyle}
              />
              <input
                type="number"
                name="number"
                placeholder="Card Number"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                style={inputStyle}
              />
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                style={inputStyle}
              />
              <input
                type="number"
                name="cvc"
                placeholder="CVC"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                style={inputStyle}
              />
              <button variant="contained" type="submit">
                Submit Card
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCardPopup}
        sx={{
          backgroundColor: "rgb(91, 112, 87)", // Default shade of green
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "rgb(75, 111, 68)", // Slightly darker green on hover
          },
          marginTop: "2rem",
          marginInline: "6rem",
        }}
      >
        Update Card
      </Button>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
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

export default Card;
