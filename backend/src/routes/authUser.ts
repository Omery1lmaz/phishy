import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authUserController';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

export default router; 