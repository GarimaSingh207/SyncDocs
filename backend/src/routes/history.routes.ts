import { Router } from 'express';
import { getDocumentHistory } from '../controllers/history.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/documents/:id/history', authenticate, getDocumentHistory);

export default router;
