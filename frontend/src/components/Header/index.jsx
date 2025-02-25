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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: "0.01px solid #ffd9009d",
        backgroundColor: "rgb(0,0,0)",
        height: "64px",
        position: "fixed",
        zIndex: "2000",
        width: "100%"
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