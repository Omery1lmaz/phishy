/**
 * Her newsletter için dinamik olarak BullMQ kuyruğu ve worker başlatır.
 * Her bir alıcıya e-posta gönderimini batch olarak yönetir ve durumunu günceller.
 * @param newsletterId Bültenin benzersiz kimliği
 * @param batchSize Her partide gönderilecek e-posta sayısı
 * @returns mailQueue ve mailWorker nesneleri
 */
import { Queue, Worker } from "bullmq";
import { redisOptions } from "./mailQueue";
import nodemailer from "nodemailer";
import Newsletter from '../models/Newsletter';
import { htmlToText } from 'html-to-text';
import logger from '../utils/logger';

export function startNewsletterWorker(newsletterId: string, batchSize: number) {
  const queueName = `mail-newsletter-${newsletterId}`;
  const mailQueue = new Queue(queueName, { connection: redisOptions });

  let jobCounter = 0;
  let totalJobs = 0;
  // Toplam iş sayısını newsletter'dan al
  Newsletter.findById(newsletterId).then(doc => {
    if (doc) totalJobs = doc.recipients.length;
  });

  logger.info(`[WORKER BAŞLADI] Kuyruk: ${queueName} | Batch size: ${batchSize}`);

  /**
   * BullMQ Worker: Kuyruktaki her işi (e-posta gönderimi) işler.
   */
  const mailWorker = new Worker(
    queueName,
    async job => {
      const { to, subject, content, smtpConfig, recipientIndex, delay } = job.data;
      jobCounter++;
      const now = new Date();
      const enqueuedAt = job.timestamp ? new Date(job.timestamp) : undefined;
      const startedAt = new Date();
      if (enqueuedAt) {
        const waitMs = startedAt.getTime() - enqueuedAt.getTime();
        if (waitMs > 1000) {
          logger.info(`[QUEUE DELAY] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Kuyruğa eklenme: ${enqueuedAt.toLocaleString()} | Başlama: ${startedAt.toLocaleString()} | Delay: ${Math.round(waitMs/1000)} sn`);
        }
      }
      logger.info(`[JOB BAŞLADI] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Başlama: ${startedAt.toLocaleString()}`);
      try {
        // E-posta gönderimi
        const transporter = nodemailer.createTransport(smtpConfig);
        const sendStart = new Date();
        await transporter.sendMail({
          from: smtpConfig.user,
          to,
          subject,
          text: htmlToText(content, { wordwrap: 130 }),
          html: content,
        });
        const sentAt = new Date();
        logger.info(`[MAIL GÖNDERİLDİ] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Gönderim Zamanı: ${sentAt.toLocaleString()} | Gönderim Süresi: ${Math.round((sentAt.getTime()-sendStart.getTime())/1000)} sn`);
        // Başarılı gönderim sonrası alıcı durumunu güncelle
        await Newsletter.updateOne(
          { _id: newsletterId, [`recipients.${recipientIndex}.email`]: to },
          {
            $set: {
              [`recipients.${recipientIndex}.status`]: 'Gönderildi',
              [`recipients.${recipientIndex}.sentAt`]: sentAt,
              [`recipients.${recipientIndex}.error`]: undefined,
            }
          }
        );
      } catch (error: any) {
        const errorAt = new Date();
        logger.error(`[MAIL HATA] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Hata Zamanı: ${errorAt.toLocaleString()} | Status: Hata | Hata: ${error?.message}`);
        // Hata durumunda alıcıya hata bilgisini yaz
        await Newsletter.updateOne(
          { _id: newsletterId, [`recipients.${recipientIndex}.email`]: to },
          {
            $set: {
              [`recipients.${recipientIndex}.status`]: 'Hata',
              [`recipients.${recipientIndex}.sentAt`]: errorAt,
              [`recipients.${recipientIndex}.error`]: error?.message || String(error),
            }
          }
        );
      }
      if (jobCounter === totalJobs) {
        logger.info(`[WORKER TAMAMLANDI] Kuyruk: ${queueName} | Toplam iş: ${totalJobs}`);
        // Tüm alıcılara gönderim tamamlandıysa newsletter'ın status'unu 'Gönderildi' yap
        await Newsletter.updateOne(
          { _id: newsletterId },
          { $set: { status: 'Gönderildi', sentAt: new Date() } }
        );
      }
    },
    {
      connection: redisOptions,
      concurrency: batchSize,
    }
  );

  return { mailQueue, mailWorker };
}

/**
 * Sadece hatalı alıcılar için dinamik BullMQ kuyruğu ve worker başlatır.
 * @param newsletterId Bültenin benzersiz kimliği
 * @param batchSize Her partide gönderilecek e-posta sayısı
 * @returns mailQueue ve mailWorker nesneleri
 */
export function startFailedNewsletterWorker(newsletterId: string, batchSize: number) {
  const queueName = `mail-newsletter-failed-${newsletterId}`;
  const mailQueue = new Queue(queueName, { connection: redisOptions });

  let jobCounter = 0;
  let totalJobs = 0;
  // Toplam iş sayısını newsletter'dan al
  Newsletter.findById(newsletterId).then(doc => {
    if (doc) totalJobs = doc.recipients.filter((r: any) => r.status === 'Hata').length;
  });

  logger.info(`[FAILED WORKER BAŞLADI] Kuyruk: ${queueName} | Batch size: ${batchSize}`);

  const mailWorker = new Worker(
    queueName,
    async job => {
      const { to, subject, content, smtpConfig, recipientIndex } = job.data;
      jobCounter++;
      const now = new Date();
      const enqueuedAt = job.timestamp ? new Date(job.timestamp) : undefined;
      const startedAt = new Date();
      if (enqueuedAt) {
        const waitMs = startedAt.getTime() - enqueuedAt.getTime();
        if (waitMs > 1000) {
          logger.info(`[FAILED QUEUE DELAY] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Kuyruğa eklenme: ${enqueuedAt.toLocaleString()} | Başlama: ${startedAt.toLocaleString()} | Delay: ${Math.round(waitMs/1000)} sn`);
        }
      }
      logger.info(`[FAILED JOB BAŞLADI] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Başlama: ${startedAt.toLocaleString()}`);
      try {
        const transporter = nodemailer.createTransport(smtpConfig);
        const sendStart = new Date();
        await transporter.sendMail({
          from: smtpConfig.user,
          to,
          subject,
          text: htmlToText(content, { wordwrap: 130 }),
          html: content,
        });
        const sentAt = new Date();
        logger.info(`[FAILED MAIL GÖNDERİLDİ] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Gönderim Zamanı: ${sentAt.toLocaleString()} | Gönderim Süresi: ${Math.round((sentAt.getTime()-sendStart.getTime())/1000)} sn`);
        await Newsletter.updateOne(
          { _id: newsletterId, [`recipients.${recipientIndex}.email`]: to },
          {
            $set: {
              [`recipients.${recipientIndex}.status`]: 'Gönderildi',
              [`recipients.${recipientIndex}.sentAt`]: sentAt,
              [`recipients.${recipientIndex}.error`]: undefined,
            }
          }
        );
      } catch (error: any) {
        const errorAt = new Date();
        logger.error(`[FAILED MAIL HATA] Kuyruk: ${queueName} | İş: ${jobCounter}/${totalJobs} | Alıcı: ${to} | Hata Zamanı: ${errorAt.toLocaleString()} | Status: Hata | Hata: ${error?.message}`);
        await Newsletter.updateOne(
          { _id: newsletterId, [`recipients.${recipientIndex}.email`]: to },
          {
            $set: {
              [`recipients.${recipientIndex}.status`]: 'Hata',
              [`recipients.${recipientIndex}.sentAt`]: errorAt,
              [`recipients.${recipientIndex}.error`]: error?.message || String(error),
            }
          }
        );
      }
      if (jobCounter === totalJobs) {
        logger.info(`[FAILED WORKER TAMAMLANDI] Kuyruk: ${queueName} | Toplam iş: ${totalJobs}`);
      }
    },
    {
      connection: redisOptions,
      concurrency: batchSize,
    }
  );

  return { mailQueue, mailWorker };
} 