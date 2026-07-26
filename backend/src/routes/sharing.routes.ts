import { Router } from 'express';
import {
  getSharedDocuments,
  getDocumentAccess,
  shareDocument,
  updateAccessRole,
  removeAccess,
} from '../controllers/sharing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/documents/shared', authenticate, getSharedDocuments);
router.get('/documents/:id/access', authenticate, getDocumentAccess);
router.post('/documents/:id/share', authenticate, shareDocument);
router.patch('/documents/:id/access/:accessId', authenticate, updateAccessRole);
router.delete('/documents/:id/access/:accessId', authenticate, removeAccess);

export default router;
