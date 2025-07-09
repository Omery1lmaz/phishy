import { body } from 'express-validator';

export const createSmtpConfigValidator = [
  body('name').notEmpty().withMessage('İsim zorunlu'),
  body('host').notEmpty().withMessage('Host zorunlu'),
  body('port').isInt({ min: 1 }).withMessage('Port zorunlu'),
  body('user').notEmpty().withMessage('Kullanıcı adı zorunlu'),
  body('pass').notEmpty().withMessage('Şifre zorunlu'),
];

export const updateSmtpConfigValidator = [
  body('name').optional().notEmpty().withMessage('İsim boş olamaz'),
  body('host').optional().notEmpty().withMessage('Host boş olamaz'),
  body('port').optional().isInt({ min: 1 }).withMessage('Port geçersiz'),
  body('user').optional().notEmpty().withMessage('Kullanıcı adı boş olamaz'),
  body('pass').optional().notEmpty().withMessage('Şifre boş olamaz'),
]; 