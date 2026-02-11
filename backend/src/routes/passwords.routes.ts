import { Router } from 'express';
import * as passwordsController from '../controllers/passwordsController';
import { authenticateToken } from '../middleware/authMiddleware';
import { standardRateLimit, strictRateLimit } from '../middleware/rateLimitMiddleware';
import { auditLog } from '../middleware/auditLogMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', standardRateLimit, passwordsController.getPasswords);
router.get('/generate', standardRateLimit, passwordsController.generateNewPassword);
router.get('/:id', strictRateLimit, auditLog('password_view', 'password'), passwordsController.getPassword);
router.post('/', standardRateLimit, auditLog('password_create', 'password'), passwordsController.createPassword);
router.put('/:id', standardRateLimit, auditLog('password_update', 'password'), passwordsController.updatePassword);
router.delete('/:id', standardRateLimit, auditLog('password_delete', 'password'), passwordsController.deletePassword);

export default router;
