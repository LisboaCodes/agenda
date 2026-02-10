import { Router } from 'express';
import * as passwordsController from '../controllers/passwordsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', passwordsController.getPasswords);
router.get('/generate', passwordsController.generateNewPassword);
router.get('/:id', passwordsController.getPassword);
router.post('/', passwordsController.createPassword);
router.put('/:id', passwordsController.updatePassword);
router.delete('/:id', passwordsController.deletePassword);

export default router;
