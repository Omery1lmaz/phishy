import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listSmtpConfigs,
  createSmtpConfig,
  verifySmtpConfigController,
  updateSmtpConfig,
  deleteSmtpConfig,
  getSmtpConfigDetail
} from '../controllers/smtpConfigController';
import { createSmtpConfigValidator, updateSmtpConfigValidator } from '../validators/smtpConfigValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', requireAuth(['admin']), listSmtpConfigs);
router.post('/', requireAuth(['admin']), createSmtpConfigValidator, validateRequest, createSmtpConfig);
router.post('/:id/verify', requireAuth(['admin']), verifySmtpConfigController);
router.get('/:id', requireAuth(['admin']), getSmtpConfigDetail);
router.put('/:id', requireAuth(['admin']), updateSmtpConfigValidator, validateRequest, updateSmtpConfig);
router.delete('/:id', requireAuth(['admin']), deleteSmtpConfig);

export default router; 