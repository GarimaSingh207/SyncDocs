import api from './api';
import type { Collaborator, SharedDocument, ShareDocumentPayload, UpdateAccessRolePayload } from '../types';

export const sharingService = {
  async getSharedDocuments(): Promise<SharedDocument[]> {
    const response = await api.get<SharedDocument[]>('/documents/shared');
    return response.data;
  },

  async getDocumentAccess(documentId: string): Promise<Collaborator[]> {
    const response = await api.get<Collaborator[]>(`/documents/${documentId}/access`);
    return response.data;
  },

  async shareDocument(documentId: string, payload: ShareDocumentPayload): Promise<Collaborator[]> {
    const response = await api.post<Collaborator[]>(`/documents/${documentId}/share`, payload);
    return response.data;
  },

  async updateAccessRole(
    documentId: string,
    accessId: string,
    payload: UpdateAccessRolePayload
  ): Promise<Collaborator[]> {
    const response = await api.patch<Collaborator[]>(`/documents/${documentId}/access/${accessId}`, payload);
    return response.data;
  },

  async removeAccess(documentId: string, accessId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/documents/${documentId}/access/${accessId}`);
    return response.data;
  },
};

export default sharingService;
