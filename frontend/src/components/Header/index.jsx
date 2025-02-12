import React from "react";
import { Button } from "@mui/material";
import { CgMenuGridR } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import "./Header.css"; 

const Header = ({ handleDrawerOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <header 
      style={{
        borderBottom: "0.01px solid #ffd9009d", // One-sided bottom border
        width: "100%", // Ensure it spans full width
      }}
    >
      <nav>
        <div className="left-nav">
          <div style={{ paddingTop: "1rem" }}>
            <Button
              onClick={handleDrawerOpen}
              style={{ color: "#ffffff", fontSize: "1.5rem" }}
            >
              <CgMenuGridR />
            </Button>
          </div>
          <div className="logo">
            <h5 className="hero-title--gradient" style={{ fontSize: "2rem", marginTop: "1rem" }}>
              Vaulet
            </h5>
          </div>
        </div>
        <div className="right-nav">
          <div className="nav-links">
            <Button style={{ color: "#ffffff" }} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
