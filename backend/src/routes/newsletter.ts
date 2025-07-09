import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listNewsletters,
  getNewsletterDetail,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  resendFailedRecipients
} from '../controllers/newsletterController';
import { createNewsletterValidator, updateNewsletterValidator } from '../validators/newsletterValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', requireAuth(['admin', 'user']), listNewsletters);
router.get('/:id', requireAuth(['admin', 'user']), getNewsletterDetail);
router.post('/', requireAuth(['admin']), createNewsletterValidator, validateRequest, createNewsletter);
router.put('/:id', requireAuth(['admin']), updateNewsletterValidator, validateRequest, updateNewsletter);
router.delete('/:id', requireAuth(['admin']), deleteNewsletter);
router.post('/:id/resend-failed', requireAuth(['admin']), resendFailedRecipients);

export default router; 