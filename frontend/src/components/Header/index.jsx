import React from 'react';
import { Link } from 'react-router-dom';
import wallet from '../../assets/walletNoBG.png';
import "./Header.css";
import Button from '@mui/material/Button';
import { BsMenuButtonWideFill } from "react-icons/bs";
import Search from '../Search';

const Header = () => {
    return (
        <header className="custom-header">
            <div className="part1">
                <Link to="/" className="d-flex align-items-center">
                    <img src={wallet} alt="Wallet Logo" className="wallet" />
                    <span className="wallet-text">Vault</span>
                </Link>
            </div>
            <div className="part2">
                <Button className="rounded-circle">
                    <BsMenuButtonWideFill />
                </Button>
                <Search/>
            </div>
        </header>

    );
};

export default Header;
