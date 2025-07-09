/**
 * BullMQ ile e-posta gönderim işleri için kullanılan ana kuyruk.
 * Redis bağlantı ayarları ile birlikte tanımlanır.
 */
import { Queue } from "bullmq";
import { RedisOptions } from "ioredis";

/**
 * Redis bağlantı ayarları.
 * Ortam değişkenlerinden alınır, yoksa varsayılan localhost ve 6379 portu kullanılır.
 */
export const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const mailQueue = new Queue("mail", { connection: redisOptions }); 