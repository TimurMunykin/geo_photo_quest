import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold">
            <Link to="/">Geo Photo Quest</Link>
          </div>
          <nav className="space-x-4 flex items-center">
            {token ? (
              <>
                <Link to="/" className="hover:text-gray-300">Map</Link>
                <Link to="/quest-management" className="hover:text-gray-300 whitespace-nowrap">Quest Management</Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-gray-300">Login/Register</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
