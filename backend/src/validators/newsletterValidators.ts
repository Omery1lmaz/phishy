import { body } from 'express-validator';

export const createNewsletterValidator = [
  body('title').notEmpty().withMessage('Başlık zorunlu'),
  body('content').notEmpty().withMessage('İçerik zorunlu'),
  body('recipients').isArray({ min: 1 }).withMessage('En az bir alıcı girilmeli'),
  body('sendTime').isISO8601().withMessage('Geçerli bir tarih girin'),
  body('batchSize').isInt({ min: 1 }).withMessage('Batch size en az 1 olmalı'),
  body('smtpConfig').notEmpty().withMessage('SMTP config zorunlu'),
];

export const updateNewsletterValidator = [
  body('title').optional().notEmpty().withMessage('Başlık boş olamaz'),
  body('content').optional().notEmpty().withMessage('İçerik boş olamaz'),
  body('recipients').optional().isArray({ min: 1 }).withMessage('En az bir alıcı girilmeli'),
  body('sendTime').optional().isISO8601().withMessage('Geçerli bir tarih girin'),
  body('batchSize').optional().isInt({ min: 1 }).withMessage('Batch size en az 1 olmalı'),
  body('smtpConfig').optional().notEmpty().withMessage('SMTP config boş olamaz'),
]; 