import { Router } from 'express';
import * as notesController from '../controllers/notesController';
import { authenticateToken } from '../middleware/authMiddleware';
import { lenientRateLimit } from '../middleware/rateLimitMiddleware';
import { auditLog } from '../middleware/auditLogMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(lenientRateLimit);

router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNote);
router.post('/', auditLog('note_create', 'note'), notesController.createNote);
router.put('/:id', auditLog('note_update', 'note'), notesController.updateNote);
router.delete('/:id', auditLog('note_delete', 'note'), notesController.deleteNote);
router.patch('/:id/pin', auditLog('note_pin_toggle', 'note'), notesController.togglePinNote);

export default router;
