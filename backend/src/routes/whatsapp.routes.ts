import { Router } from 'express';
import * as whatsappController from '../controllers/whatsappController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/webhook', whatsappController.webhook);
router.post('/send', authenticateToken, whatsappController.sendMessage);
router.post('/connect', authenticateToken, whatsappController.connectPhone);
router.get('/status', authenticateToken, whatsappController.getStatus);

export default router;
