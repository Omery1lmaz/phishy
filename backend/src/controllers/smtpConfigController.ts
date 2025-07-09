import { Request, Response } from 'express';
import { SmtpConfigService } from '../models/SmtpConfigService';
import nodemailer from 'nodemailer';

const smtpConfigService = new SmtpConfigService();

/**
 * Tüm SMTP yapılandırmalarını listeler.
 */
export async function listSmtpConfigs(req: Request, res: Response) {
  try {
    const configs = await smtpConfigService.getConfigs({});
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Yeni bir SMTP yapılandırması oluşturur.
 */
export async function createSmtpConfig(req: Request, res: Response) {
  try {
    const { name, host, port, user: smtpUser, pass } = req.body;
    const user = (req as any).user.id;
    if (!name || !host || !port || !pass) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur', req: user });
    }
    const config = await smtpConfigService.createConfig({ name, host, port, user: smtpUser, pass, verified: false });
    res.status(201).json(config);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * SMTP yapılandırmasını doğrular ve verified alanını günceller.
 */
export async function verifySmtpConfigController(req: Request, res: Response) {
  try {
    const config = await smtpConfigService.getConfigById(req.params.id);
    if (!config) return res.status(404).json({ error: 'Config bulunamadı' });

    // SMTP bağlantısını test et
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      secure: config.port === 465, // genellikle 465 SSL, 587 TLS
    });

    await transporter.verify();

    await smtpConfigService.updateConfig((config._id as string), { verified: true });

    res.json({ success: true, verified: true });
  } catch (err: any) {
    res.status(400).json({ success: false, verified: false, error: err.message });
  }
}

/**
 * Var olan bir SMTP yapılandırmasını günceller.
 */
export async function updateSmtpConfig(req: Request, res: Response) {
  try {
    const { name, host, port, user, pass } = req.body;
    const updated = await smtpConfigService.updateConfig(
      req.params.id,
      { name, host, port, user, pass }
    );
    if (!updated) return res.status(404).json({ error: 'SMTP config bulunamadı' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Bir SMTP yapılandırmasını siler.
 */
export async function deleteSmtpConfig(req: Request, res: Response) {
  try {
    const deleted = await smtpConfigService.deleteConfig(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'SMTP config bulunamadı' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Belirli bir SMTP yapılandırmasının detayını getirir.
 */
export async function getSmtpConfigDetail(req: Request, res: Response) {
  try {
    const config = await smtpConfigService.getConfigById(req.params.id);
    if (!config) return res.status(404).json({ error: 'SMTP config bulunamadı' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
} 