import { Router } from 'express';
import {
  getDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from '../controllers/document.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/documents', authenticate, getDocuments);
router.post('/documents', authenticate, createDocument);
router.get('/documents/:id', authenticate, getDocumentById);
router.patch('/documents/:id', authenticate, updateDocument);
router.delete('/documents/:id', authenticate, deleteDocument);

export default router;
