import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SyncDocs</Link>
      </div>
      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/documents">Documents</Link>
        <Link to="/documents/demo-doc-1">Editor Demo</Link>
      </div>
    </nav>
  );
};

export default Navbar;
