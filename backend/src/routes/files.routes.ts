import { Router } from 'express';
import * as filesController from '../controllers/filesController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', filesController.getFiles);
router.get('/:id', filesController.getFile);
router.post('/upload', uploadSingle, filesController.uploadFileHandler);
router.delete('/:id', filesController.deleteFileHandler);

export default router;
