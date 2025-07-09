import { Request, Response } from 'express';
import { AppUserService } from '../models/AppUserService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const appUserService = new AppUserService();

/**
 * Kullanıcı kaydı oluşturur.
 */
export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunlu' });
    const existing = await appUserService.getUsers({ email });
    if (existing && existing.length > 0) return res.status(400).json({ error: 'Email zaten kayıtlı' });
    const hash = await bcrypt.hash(password, 10);
    const user = await appUserService.createUser({ email, password: hash });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Kullanıcı girişi yapar ve JWT token döner.
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const users = await appUserService.getUsers({ email });
    const user = users && users.length > 0 ? users[0] : null;
    if (!user) return res.status(400).json({ error: 'Geçersiz email veya şifre' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Geçersiz email veya şifre' });
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
} 