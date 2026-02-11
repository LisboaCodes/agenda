import { Router } from 'express';
import * as securityController from '../controllers/securityController';
import { authMiddleware } from '../middleware/authMiddleware';
import { strictRateLimit } from '../middleware/rateLimitMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// 2FA routes
router.post('/2fa/enable', strictRateLimit, securityController.enable2FA);
router.post('/2fa/verify', strictRateLimit, securityController.verify2FA);
router.post('/2fa/disable', strictRateLimit, securityController.disable2FA);

// Audit logs
router.get('/audit-logs', securityController.getAuditLogs);

// Security summary
router.get('/summary', securityController.getSecuritySummary);

export default router;
