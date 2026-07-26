import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Document } from '../types';
import documentService from '../services/documents';
import axios from 'axios';

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await documentService.getDocumentById(id);
        setDocument(doc);
        setTitle(doc.title);
        setContent(doc.content);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load document.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleSave = async () => {
    if (!id || !title.trim()) return;

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const updated = await documentService.updateDocument(id, {
        title: title.trim(),
        content,
      });
      setDocument(updated);
      setTitle(updated.title);
      setContent(updated.content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save document.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading document editor...</p>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/documents')} className="btn btn-secondary">
          ← Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="page-container editor-container">
      <div className="editor-header">
        <button onClick={() => navigate('/documents')} className="btn btn-secondary">
          ← Back to Documents
        </button>
        <div className="editor-actions">
          {saveSuccess && <span className="save-status">✓ Saved</span>}
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={saving || !title.trim()}
          >
            {saving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="editor-title-group">
        <input
          type="text"
          className="editor-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          disabled={saving}
        />
      </div>

      <div className="editor-body">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your document content here..."
          disabled={saving}
        />
      </div>
    </div>
  );
};

export default DocumentEditorPage;
