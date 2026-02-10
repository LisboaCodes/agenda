import { Router } from 'express';
import * as notesController from '../controllers/notesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNote);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.patch('/:id/pin', notesController.togglePinNote);

export default router;
