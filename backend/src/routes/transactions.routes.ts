import { Router } from 'express';
import * as transactionsController from '../controllers/transactionsController';
import { authenticateToken } from '../middleware/authMiddleware';
import { lenientRateLimit } from '../middleware/rateLimitMiddleware';
import { auditLog } from '../middleware/auditLogMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(lenientRateLimit);

router.get('/', transactionsController.getTransactions);
router.get('/summary', transactionsController.getSummary);
router.get('/:id', transactionsController.getTransaction);
router.post('/', auditLog('transaction_create', 'transaction'), transactionsController.createTransaction);
router.put('/:id', auditLog('transaction_update', 'transaction'), transactionsController.updateTransaction);
router.delete('/:id', auditLog('transaction_delete', 'transaction'), transactionsController.deleteTransaction);

export default router;
