import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/profile', authenticate, getProfile);

export default router;
