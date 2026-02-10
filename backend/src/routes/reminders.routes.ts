import { Router } from 'express';
import * as remindersController from '../controllers/remindersController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', remindersController.getReminders);
router.get('/upcoming', remindersController.getUpcoming);
router.get('/:id', remindersController.getReminder);
router.post('/', remindersController.createReminder);
router.put('/:id', remindersController.updateReminder);
router.patch('/:id/complete', remindersController.completeReminder);
router.delete('/:id', remindersController.deleteReminder);

export default router;
