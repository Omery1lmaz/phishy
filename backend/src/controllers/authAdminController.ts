import { Request, Response } from 'express';
import { AdminUserService } from '../models/AdminUserService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminUserService = new AdminUserService();

/**
 * Yönetici kaydı oluşturur.
 */
export async function registerAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunlu' });
    const existing = await adminUserService.getAdmins({ email });
    if (existing && existing.length > 0) return res.status(400).json({ error: 'Email zaten kayıtlı' });
    const hash = await bcrypt.hash(password, 10);
    const user = await adminUserService.createAdmin({ email, password: hash });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Yönetici girişi yapar ve JWT token döner.
 */
export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const admins = await adminUserService.getAdmins({ email });
    const user = admins && admins.length > 0 ? admins[0] : null;
    if (!user) return res.status(400).json({ error: 'Geçersiz email veya şifre' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Geçersiz email veya şifre' });
    const token = jwt.sign({ id: user._id, type: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
} 