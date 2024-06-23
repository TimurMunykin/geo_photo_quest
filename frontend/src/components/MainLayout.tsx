import React from 'react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold">
            <Link to="/">Geo Photo Quest</Link>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/quest-management" className="hover:text-gray-300">Quest Management</Link>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
