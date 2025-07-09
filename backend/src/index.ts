import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import newsletterRoutes from './routes/newsletter';
import smtpConfigRoutes from './routes/smtpConfig';
import authAdminRoutes from './routes/authAdmin';
import authUserRoutes from './routes/authUser';
import './queue/mailWorker';
import { startNewsletterWorker } from './queue/dynamicNewsletterWorker';
import Newsletter from './models/Newsletter';

dotenv.config();

const app = express();
app.use(express.json());

// Helmet gelişmiş ayarları
app.use(helmet({
  contentSecurityPolicy: false,
  referrerPolicy: { policy: "no-referrer" },
  crossOriginResourcePolicy: { policy: "same-origin" },
}));

// CORS sadece frontend'e izin ver
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Rate limit: IP başına 100 istek/15dk
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Basit request logu
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

app.use('/newsletters', newsletterRoutes);
app.use('/smtp-configs', smtpConfigRoutes);
app.use('/auth/admin', authAdminRoutes);
app.use('/auth/user', authUserRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newsletter';

mongoose.connect(MONGO_URI)
  .then(async () => {
    // Sunucu başlatılırken aktif newsletterlar için worker başlat
    const activeNewsletters = await Newsletter.find({ status: { $in: ['Planlandı', 'Gönderiliyor'] } });
    for (const n of activeNewsletters) {
      const newsletterId = String(n._id);
      const batchSize = Number(n.batchSize) || 10;
      startNewsletterWorker(newsletterId, batchSize);
    }
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error: %o', err);
  }); 