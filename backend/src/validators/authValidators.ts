import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('Geçerli bir email girin'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Geçerli bir email girin'),
  body('password').notEmpty().withMessage('Şifre zorunlu'),
]; 