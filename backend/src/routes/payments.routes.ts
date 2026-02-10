import { Router } from 'express';
import * as paymentsController from '../controllers/paymentsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', paymentsController.getPayments);
router.get('/:id', paymentsController.getPayment);
router.post('/', paymentsController.createPayment);
router.put('/:id', paymentsController.updatePayment);
router.patch('/:id/mark-paid', paymentsController.markAsPaid);
router.delete('/:id', paymentsController.deletePayment);

export default router;
