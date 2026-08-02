import React, { useState } from 'react';
import './NotificationsPage.css';

interface NotificationItem {
  id: string;
  author: string;
  action: string;
  target: string;
  snippet?: string;
  timestamp: string;
  category: 'mention' | 'comment' | 'invitation' | 'document' | 'system';
  unread: boolean;
  timeGroup: 'Today' | 'Yesterday' | 'Older';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    author: 'Sarah Chen',
    action: 'commented on',
    target: 'Backend Architecture',
    snippet: '"We should consider using Redis for the new caching layer..."',
    timestamp: '2m ago',
    category: 'comment',
    unread: true,
    timeGroup: 'Today',
  },
  {
    id: 'n2',
    author: 'Rahul Mehta',
    action: 'invited you to collaborate on',
    target: 'Product Roadmap 2024',
    timestamp: '1h ago',
    category: 'invitation',
    unread: true,
    timeGroup: 'Today',
  },
  {
    id: 'n3',
    author: 'Emily Davis',
    action: 'shared document',
    target: 'API Documentation v2',
    timestamp: 'Yesterday',
    category: 'document',
    unread: false,
    timeGroup: 'Yesterday',
  },
  {
    id: 'n4',
    author: 'Alex Johnson',
    action: 'mentioned you in',
    target: 'Team Sync Notes',
    snippet: '"@User please review the Q3 goals list before tomorrow."',
    timestamp: 'Yesterday',
    category: 'mention',
    unread: false,
    timeGroup: 'Yesterday',
  },
  {
    id: 'n5',
    author: 'SyncDocs System',
    action: 'completed system update',
    target: 'Engine v4.2 Deployment',
    timestamp: '3 days ago',
    category: 'system',
    unread: false,
    timeGroup: 'Older',
  },
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread' && !n.unread) return false;
    if (activeFilter === 'mentions' && n.category !== 'mention') return false;
    if (activeFilter === 'comments' && n.category !== 'comment') return false;
    if (activeFilter === 'invitations' && n.category !== 'invitation') return false;
    if (activeFilter === 'documents' && n.category !== 'document') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.author.toLowerCase().includes(q) ||
        n.target.toLowerCase().includes(q) ||
        (n.snippet && n.snippet.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;
  const todayItems = filteredNotifications.filter((n) => n.timeGroup === 'Today');
  const yesterdayItems = filteredNotifications.filter((n) => n.timeGroup === 'Yesterday');
  const olderItems = filteredNotifications.filter((n) => n.timeGroup === 'Older');

  return (
    <div className="notifications-page-wrapper">
      {/* Header */}
      <div className="notifications-top-bar">
        <div>
          <h1 className="notifications-bar-title">Notifications Center</h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#9ca3af' }}>
            Real-time activity logs, document mentions, and collaborator notifications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="back-btn" onClick={handleMarkAllRead}>
            ✓ Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="notifications-filter-strip">
        <div className="filter-pills-group">
          {['all', 'unread', 'mentions', 'comments', 'invitations', 'documents'].map((f) => (
            <button
              key={f}
              className={`filter-pill-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="search-input"
          style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          placeholder="Filter notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Split Grid */}
      <div className="notifications-grid-layout">
        {/* Left Notifications List */}
        <div className="notifications-list-panel">
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No notifications found matching filter.</p>
            </div>
          ) : (
            <>
              {todayItems.length > 0 && (
                <div>
                  <h3 className="notification-group-title">Today</h3>
                  {todayItems.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item-card ${n.unread ? 'unread' : ''}`}
                      onClick={() => handleToggleUnread(n.id)}
                    >
                      {n.unread && <div className="unread-dot-glow"></div>}
                      <div className="notification-avatar-box">
                        {n.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="notification-body-content">
                        <p className="notification-message">
                          <strong>{n.author}</strong> {n.action}{' '}
                          <span style={{ color: '#818cf8', fontWeight: 600 }}>{n.target}</span>
                        </p>
                        {n.snippet && <p className="notification-snippet">{n.snippet}</p>}
                      </div>
                      <span className="notification-timestamp">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}

              {yesterdayItems.length > 0 && (
                <div>
                  <h3 className="notification-group-title">Yesterday</h3>
                  {yesterdayItems.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item-card ${n.unread ? 'unread' : ''}`}
                      onClick={() => handleToggleUnread(n.id)}
                    >
                      {n.unread && <div className="unread-dot-glow"></div>}
                      <div className="notification-avatar-box">
                        {n.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="notification-body-content">
                        <p className="notification-message">
                          <strong>{n.author}</strong> {n.action}{' '}
                          <span style={{ color: '#818cf8', fontWeight: 600 }}>{n.target}</span>
                        </p>
                        {n.snippet && <p className="notification-snippet">{n.snippet}</p>}
                      </div>
                      <span className="notification-timestamp">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}

              {olderItems.length > 0 && (
                <div>
                  <h3 className="notification-group-title">Older</h3>
                  {olderItems.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item-card ${n.unread ? 'unread' : ''}`}
                      onClick={() => handleToggleUnread(n.id)}
                    >
                      {n.unread && <div className="unread-dot-glow"></div>}
                      <div className="notification-avatar-box">
                        {n.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="notification-body-content">
                        <p className="notification-message">
                          <strong>{n.author}</strong> {n.action}{' '}
                          <span style={{ color: '#818cf8', fontWeight: 600 }}>{n.target}</span>
                        </p>
                      </div>
                      <span className="notification-timestamp">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Insights Sidebar */}
        <div className="notifications-insights-panel">
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#f3f4f6' }}>Activity Insights</h3>

          <div className="insights-card-grid">
            <div className="insight-metric-box">
              <span className="insight-number">{unreadCount}</span>
              <span className="insight-label">Unread</span>
            </div>
            <div className="insight-metric-box">
              <span className="insight-number">{notifications.length}</span>
              <span className="insight-label">Total</span>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <span className="insight-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              7-Day Activity Graph
            </span>
            <div className="activity-bar-chart">
              <div className="activity-bar" style={{ height: '40%' }}></div>
              <div className="activity-bar" style={{ height: '65%' }}></div>
              <div className="activity-bar" style={{ height: '35%' }}></div>
              <div className="activity-bar" style={{ height: '80%' }}></div>
              <div className="activity-bar" style={{ height: '50%' }}></div>
              <div className="activity-bar" style={{ height: '95%' }}></div>
              <div className="activity-bar" style={{ height: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
