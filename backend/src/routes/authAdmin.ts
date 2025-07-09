import { Router } from 'express';
import { registerAdmin, loginAdmin } from '../controllers/authAdminController';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/register', registerValidator, validateRequest, registerAdmin);
router.post('/login', loginValidator, validateRequest, loginAdmin);

export default router; 