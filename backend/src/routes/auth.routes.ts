import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { strictRateLimit, standardRateLimit } from '../middleware/rateLimitMiddleware';
import { auditLog } from '../middleware/auditLogMiddleware';

const router = Router();

router.post('/register', strictRateLimit, auditLog('user_register', 'user'), authController.register);
router.post('/login', strictRateLimit, auditLog('user_login', 'user'), authController.login);
router.post('/refresh', standardRateLimit, authController.refresh);
router.get('/me', authenticateToken, authController.getMe);
router.put('/profile', authenticateToken, auditLog('user_update_profile', 'user'), authController.updateProfile);
router.post('/change-password', authenticateToken, strictRateLimit, auditLog('user_change_password', 'user'), authController.changePassword);

export default router;
