import React from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ onHomeClick, onHistoryClick, onAdminClick }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar-content glass-panel">
        <div className="navbar-left">
          <img
            src={logo}
            alt="VDart Logo"
            className="brand-logo-img"
            onClick={(e) => { e.preventDefault(); onHomeClick && onHomeClick(); }}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="navbar-center">
          <a
            href="#"
            className="nav-link active"
            onClick={(e) => { e.preventDefault(); onHomeClick && onHomeClick(); }}
          >
            Home
          </a>
          <a href="#" className="nav-link">Guide</a>
        </div>

        <div className="navbar-right">
          <button className="btn btn-primary" onClick={onHistoryClick}>History Tracking</button>
          <button className="btn btn-primary" onClick={onAdminClick}>Admin Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
