import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { EditEventItem } from '../types';
import historyService from '../services/history';
import documentService from '../services/documents';
import axios from 'axios';
import './VersionHistoryPage.css';

export const VersionHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [historyEvents, setHistoryEvents] = useState<EditEventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EditEventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await historyService.getDocumentHistory(id, 1, 30);
        setHistoryEvents(res.events);
        if (res.events.length > 0) {
          setSelectedEvent(res.events[0]);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load version history.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  const handleRestore = async () => {
    if (!id || !selectedEvent) return;

    if (!window.confirm(`Restore document to version from ${new Date(selectedEvent.createdAt).toLocaleString()}?`)) {
      return;
    }

    setRestoring(true);
    setError(null);
    try {
      await documentService.updateDocument(id, {
        title: selectedEvent.title,
        content: selectedEvent.content,
      });
      navigate(`/documents/${id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to restore document version.');
      }
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="version-history-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading document version control timeline...</p>
      </div>
    );
  }

  return (
    <div className="version-history-wrapper">
      {/* Header Bar */}
      <div className="history-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(`/documents/${id}`)} className="back-btn">
            ← Back to Editor
          </button>
          <h1 className="history-bar-title">Version Control Timeline</h1>
        </div>

        {selectedEvent && (
          <button onClick={handleRestore} className="create-doc-btn" disabled={restoring}>
            {restoring ? 'Restoring...' : '↺ Restore Selected Version'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Main Split Grid */}
      <div className="history-content-grid">
        {/* Left Side Timeline */}
        <div className="history-timeline-panel">
          <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Historical Snapshots ({historyEvents.length})
          </h3>

          {historyEvents.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No version history recorded yet.</p>
          ) : (
            historyEvents.map((evt) => (
              <div
                key={evt.id}
                className={`history-event-card ${selectedEvent?.id === evt.id ? 'selected' : ''}`}
                onClick={() => setSelectedEvent(evt)}
              >
                <div className="history-card-header">
                  <span className="history-author-name">{evt.userName}</span>
                  <span className="history-timestamp">{new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h4 className="history-doc-title">{evt.title}</h4>
              </div>
            ))
          )}
        </div>

        {/* Center Paper Canvas Preview */}
        <div className="history-preview-canvas">
          {selectedEvent ? (
            <>
              <h2 className="preview-doc-heading">{selectedEvent.title}</h2>
              <div className="preview-doc-body">
                {selectedEvent.content || <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Empty document content at this snapshot.</span>}
              </div>
            </>
          ) : (
            <p style={{ color: '#9ca3af' }}>Select a snapshot from the left timeline to preview content.</p>
          )}
        </div>

        {/* Right Attributes Panel */}
        <div className="history-details-panel">
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#f3f4f6' }}>Snapshot Attributes</h3>
          {selectedEvent ? (
            <>
              <div className="attribute-row">
                <span className="attribute-label">Editor</span>
                <span className="attribute-val">{selectedEvent.userName}</span>
              </div>
              <div className="attribute-row">
                <span className="attribute-label">Created At</span>
                <span className="attribute-val">{new Date(selectedEvent.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="attribute-row">
                <span className="attribute-label">Time</span>
                <span className="attribute-val">{new Date(selectedEvent.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="attribute-row">
                <span className="attribute-label">Snapshot ID</span>
                <span className="attribute-val" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {selectedEvent.id.substring(0, 12)}...
                </span>
              </div>
            </>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No snapshot selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryPage;
