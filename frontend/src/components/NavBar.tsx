import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/quest-management">Quest Management</Link> {/* Add this line */}
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
};

export default NavBar;
