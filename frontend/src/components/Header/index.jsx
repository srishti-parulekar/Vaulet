import React from "react";
import { Button, Link } from "@mui/material";
import { CgMenuGridR } from "react-icons/cg";
import walletImage from "../../assets/walletNoBG.png";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = ({ handleDrawerOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    navigate("/logout")
  }
  return (
    // style={{ zIndex: 100, position: "relative" }}
    <header >
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
            {/* <img
              src={walletImage}
              alt="wallet"
              style={{ width: "70px", height: "auto" }}
            /> */}
            <h5 className="hero-title--gradient" style={{fontSize: "2.5rem", margin: "0.5rem"}}>Vaulet</h5>
          </div>
        </div>
        <div className="right-nav">
          <div className="nav-links">
            <Button style={{color: "#ffffff"}} onClick={
              handleLogout
            }>Logout</Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
