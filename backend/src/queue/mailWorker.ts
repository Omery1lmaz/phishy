/**
 * BullMQ mail kuyruğu için event listener'ları.
 * Görev tamamlandığında veya hata aldığında loglama yapar.
 */
import { QueueEvents } from "bullmq";
import { redisOptions } from "./mailQueue";
import logger from '../utils/logger';

const queueEvents = new QueueEvents("mail", { connection: redisOptions });

/**
 * Mail job başarıyla tamamlandığında loglar.
 */
queueEvents.on("completed", ({ jobId }) => {
  logger.info(`Mail job ${jobId} completed`);
});

/**
 * Mail job başarısız olduğunda hata loglar.
 */
queueEvents.on("failed", ({ jobId, failedReason }) => {
  logger.error(`Mail job ${jobId} failed: ${failedReason}`);
}); 