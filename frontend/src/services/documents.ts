import api from './api';
import type { Document, CreateDocumentPayload, UpdateDocumentPayload } from '../types';

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    const response = await api.get<Document[]>('/documents');
    return response.data;
  },

  async getDocumentById(id: string): Promise<Document> {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async createDocument(payload: CreateDocumentPayload): Promise<Document> {
    const response = await api.post<Document>('/documents', payload);
    return response.data;
  },

  async updateDocument(id: string, payload: UpdateDocumentPayload): Promise<Document> {
    const response = await api.patch<Document>(`/documents/${id}`, payload);
    return response.data;
  },

  async deleteDocument(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;
