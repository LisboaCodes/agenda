import { Router } from 'express';
import * as servicesController from '../controllers/servicesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', servicesController.getServices);
router.get('/:id', servicesController.getService);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

export default router;
