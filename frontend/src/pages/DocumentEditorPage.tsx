import React from 'react';
import { useParams } from 'react-router-dom';

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-container">
      <h2>Document Editor</h2>
      <p>Editing Document ID: {id || 'New Document'}</p>
    </div>
  );
};

export default DocumentEditorPage;
