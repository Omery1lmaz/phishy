/**
 * Belirli bir rol için JWT tabanlı kimlik doğrulama middleware'i.
 * İlgili rolde kullanıcı yoksa veya token geçersizse isteği reddeder.
 * @param role Gerekli kullanıcı rolü ('admin' veya 'user')
 * @returns Express middleware fonksiyonu
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(roles: ('admin' | 'user')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    try {
      const token = auth.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Rol kontrolü
      if (!roles.includes(payload.type)) {
        return res.status(403).json({ error: 'Yetkisiz' });
      }

      (req as any).user = payload;
      next();
    } catch {
      return res.status(401).json({ error: 'Geçersiz token' });
    }
  };
}
