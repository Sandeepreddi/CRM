import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white ${
      location.pathname === path ? 'bg-blue-500 text-white' : 'text-gray-700'
    }`;

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4 shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">CRM</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className={linkClasses('/')}>
          Dashboard
        </Link>
        <Link to="/leads" className={linkClasses('/contacts')}>
          Leads
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
