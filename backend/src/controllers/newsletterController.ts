import { Request, Response } from 'express';
import { NewsletterService } from '../models/NewsletterService';
import { SmtpConfigService } from '../models/SmtpConfigService';
import { validateEmail } from '../utils/validateEmail';
import { startNewsletterWorker, startFailedNewsletterWorker } from '../queue/dynamicNewsletterWorker';
import { Queue, Worker } from 'bullmq';

const newsletterService = new NewsletterService();
const smtpConfigService = new SmtpConfigService();

/**
 * Tüm bültenleri listeler.
 */
export async function listNewsletters(req: Request, res: Response) {
  try {
    const newsletters = await newsletterService.getNewsletters({});
    res.json(newsletters);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Belirli bir bültenin detayını getirir.
 */
export async function getNewsletterDetail(req: Request, res: Response) {
  try {
    const newsletter = await newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) return res.status(404).json({ error: 'Bülten bulunamadı' });
    res.json(newsletter);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Yeni bir bülten oluşturur ve gönderim kuyruğunu başlatır.
 */
export async function createNewsletter(req: Request, res: Response) {
  try {
    const { title, content, recipients, sendTime, batchSize, smtpConfig, delay } = req.body;
    if (!title || !content || !recipients || !sendTime || !batchSize || !smtpConfig) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'En az bir alıcı e-posta adresi girilmeli' });
    }
    for (const email of recipients) {
      if (!validateEmail(email)) {
        return res.status(400).json({ error: `Geçersiz e-posta: ${email}` });
      }
    }
    // SMTP config'i kontrol et
    const smtpConfigDoc = await smtpConfigService.getConfigById(smtpConfig);
    if (!smtpConfigDoc) {
      return res.status(400).json({ error: 'SMTP config bulunamadı' });
    }
    // recipients: string[] yerine, recipients: { email, status, createdAt }[]
    const recipientObjs = recipients.map((email: string) => ({
      email,
      status: 'Sırada' as const,
      createdAt: new Date(),
    }));
    const newsletter = await newsletterService.createNewsletter({
      title,
      content,
      recipients: recipientObjs,
      sendTime,
      batchSize,
      smtpConfig: smtpConfigDoc._id as any, // Types.ObjectId olarak tip uyumu için
      status: 'Planlandı',
      delay: delay || 0,
    });
    // Dinamik worker ve kuyruk başlat
    const newsletterIdStr = String(newsletter._id);
    const { mailQueue } = startNewsletterWorker(newsletterIdStr, batchSize);
    const now = Date.now();
    const sendAt = new Date(sendTime).getTime();
    const testsmtpConfig = {
      host: smtpConfigDoc.host,
      port: smtpConfigDoc.port,
      auth: {
        user: smtpConfigDoc.user,
        pass: smtpConfigDoc.pass
      },
      secure: Number(smtpConfigDoc.port) === 465,
    };
    for (let i = 0; i < recipientObjs.length; i++) {
      const email = recipientObjs[i].email;
      await mailQueue.add(
        'send-newsletter',
        {
          to: email,
          subject: title,
          content,
          smtpConfig: testsmtpConfig,
          newsletterId: newsletterIdStr,
          recipientIndex: i,
          delay: delay || 0,
        },
        {
          delay: Math.max(sendAt - now, 0) + (delay || 0) * 1000 * Math.floor(i / batchSize),
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        }
      );
    }
    res.status(201).json(newsletter);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Var olan bir bülteni günceller.
 */
export async function updateNewsletter(req: Request, res: Response) {
  try {
    const { title, content, recipients, sendTime, batchSize, smtpConfig, status, delay } = req.body;
    let updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (recipients !== undefined) {
      // Eğer recipients string[] ise, objeye çevir
      if (Array.isArray(recipients) && recipients.length > 0 && typeof recipients[0] === 'string') {
        updateData.recipients = recipients.map((email: string) => ({
          email,
          status: 'Sırada',
          createdAt: new Date(),
        }));
      } else {
        updateData.recipients = recipients;
      }
    }
    if (sendTime !== undefined) updateData.sendTime = sendTime;
    if (batchSize !== undefined) updateData.batchSize = batchSize;
    if (smtpConfig !== undefined) updateData.smtpConfig = smtpConfig;
    if (status !== undefined) updateData.status = status;
    if (delay !== undefined) updateData.delay = delay;
    const updated = await newsletterService.updateNewsletter(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Bülten bulunamadı' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Bir bülteni siler.
 */
export async function deleteNewsletter(req: Request, res: Response) {
  try {
    const deleted = await newsletterService.deleteNewsletter(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bülten bulunamadı' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
}

/**
 * Hatalı alıcılara tekrar gönderim başlatır.
 */
export async function resendFailedRecipients(req: Request, res: Response) {
  try {
    const newsletter = await newsletterService.getNewsletterById(req.params.id);
    if (!newsletter) return res.status(404).json({ error: 'Bülten bulunamadı' });
    const failedRecipients = newsletter.recipients
      .map((r: any, idx: number) => ({ ...r.toObject(), idx }))
      .filter((r: any) => r.status === 'Hata');
    if (failedRecipients.length === 0) {
      return res.status(400).json({ error: 'Hatalı alıcı yok' });
    }
    // SMTP config'i getir
    const smtpConfigDoc = await smtpConfigService.getConfigById(String(newsletter.smtpConfig));
    if (!smtpConfigDoc) {
      return res.status(400).json({ error: 'SMTP config bulunamadı' });
    }
    const testsmtpConfig = {
      host: smtpConfigDoc.host,
      port: smtpConfigDoc.port,
      auth: {
        user: smtpConfigDoc.user,
        pass: smtpConfigDoc.pass
      },
      secure: Number(smtpConfigDoc.port) === 465,
    };
    // Sadece hatalılar için özel queue ve worker başlat
    const { mailQueue } = startFailedNewsletterWorker(String(newsletter._id), newsletter.batchSize);
    for (const r of failedRecipients) {
      await mailQueue.add(
        'send-newsletter-failed',
        {
          to: r.email,
          subject: newsletter.title,
          content: newsletter.content,
          smtpConfig: testsmtpConfig,
          newsletterId: String(newsletter._id),
          recipientIndex: r.idx,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        }
      );
      // Status'ü tekrar 'Sırada' yap
      newsletter.recipients[r.idx].status = 'Sırada';
      newsletter.recipients[r.idx].error = undefined;
    }
    await newsletter.save();
    res.json({ success: true, resent: failedRecipients.length });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası', details: err });
  }
} 