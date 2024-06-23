import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/" className="hover:text-gray-300">Map</Link>
        </div>
        <div className="space-x-4">
          <Link to="/quest-management" className="text-white hover:text-gray-300">Quest Management</Link>
          <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
