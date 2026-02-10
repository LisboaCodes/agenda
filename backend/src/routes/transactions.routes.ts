import { Router } from 'express';
import * as transactionsController from '../controllers/transactionsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', transactionsController.getTransactions);
router.get('/summary', transactionsController.getSummary);
router.get('/:id', transactionsController.getTransaction);
router.post('/', transactionsController.createTransaction);
router.put('/:id', transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

export default router;
