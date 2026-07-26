import api from './api';
import type { HistoryResponse } from '../types';

export const historyService = {
  async getDocumentHistory(documentId: string, page: number = 1, limit: number = 10): Promise<HistoryResponse> {
    const response = await api.get<HistoryResponse>(`/documents/${documentId}/history`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export default historyService;
