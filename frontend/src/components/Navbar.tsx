import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user ? '/dashboard' : '/login'}>SyncDocs</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/documents">Documents</Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
