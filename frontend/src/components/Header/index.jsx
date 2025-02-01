import React from "react";
import { Button } from "@mui/material";
import { CgMenuGridR } from "react-icons/cg";
import walletImage from "../../assets/walletNoBG.png";
import "./Header.css";
const Header = ({ handleDrawerOpen }) => {
  return (
    <header style={{ zIndex: 100, position: "relative" }}>
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
            <img
              src={walletImage}
              alt="wallet"
              style={{ width: "70px", height: "auto" }}
            />
            Vaulet
          </div>
        </div>
        <div className="right-nav">
          <ul className="nav-links">
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
