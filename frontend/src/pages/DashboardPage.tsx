import React from 'react';
import useAuth from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}</h2>
      <p>Your SyncDocs account overview.</p>

      <div className="profile-details" style={{ marginTop: '1.5rem', lineHeight: '1.8' }}>
        <p><strong>Email Address:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>User ID:</strong> <code style={{ backgroundColor: '#111827', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{user.id}</code></p>
      </div>
    </div>
  );
};

export default DashboardPage;
