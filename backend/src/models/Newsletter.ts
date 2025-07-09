import mongoose, { Document, Schema, Types, Model } from 'mongoose';

/**
 * Bültenin mevcut durumunu temsil eden tip.
 * 'Planlandı': Gönderilmek üzere planlandı
 * 'Gönderildi': Tüm alıcılara gönderildi
 * 'Kısmen Gönderildi': Bazı alıcılarda hata var
 */
export type NewsletterStatus = 'Planlandı' | 'Gönderildi' | 'Kısmen Gönderildi';

/**
 * Bir bülten alıcısının bilgilerini ve gönderim durumunu tutar.
 */
export interface INewsletterRecipient {
  /** Alıcının e-posta adresi */
  email: string;
  /** Alıcıya gönderim durumu */
  status: 'Sırada' | 'Gönderildi' | 'Hata';
  /** Alıcı kaydının oluşturulma zamanı */
  createdAt: Date;
  /** E-posta gönderim zamanı (varsa) */
  sentAt?: Date;
  /** Gönderim hatası mesajı (varsa) */
  error?: string;
}

/**
 * Newsletter dokümanının arayüzü. Mongoose ile uyumlu.
 */
export interface INewsletter extends Document {
  /** Bülten başlığı */
  title: string;
  /** Bülten içeriği */
  content: string;
  /** Alıcı listesi */
  recipients: INewsletterRecipient[];
  /** Gönderim zamanı */
  sendTime: Date;
  /** Her partide gönderilecek e-posta sayısı */
  batchSize: number;
  /** Kullanılacak SMTP yapılandırmasının referansı */
  smtpConfig: Types.ObjectId;
  /** Bültenin mevcut durumu */
  status: NewsletterStatus;
  /** Gönderim tamamlandığında set edilir */
  sentAt?: Date;
  /** Oluşturulma zamanı */
  createdAt: Date;
  /** Güncellenme zamanı */
  updatedAt: Date;
  /** Gönderim gecikmesi (saniye cinsinden, opsiyonel) */
  delay?: number;
}

/**
 * Alıcı alt şeması. Her bir bültenin alıcılarını tutar.
 */
const NewsletterRecipientSchema = new Schema<INewsletterRecipient>({
  email: { type: String, required: true },
  status: { type: String, enum: ['Sırada', 'Gönderildi', 'Hata'], default: 'Sırada' },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
  error: { type: String },
});

/**
 * Newsletter ana şeması. Bültenin tüm temel bilgilerini ve alıcı listesini içerir.
 */
const NewsletterSchema = new Schema<INewsletter>({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  recipients: { type: [NewsletterRecipientSchema], required: true },
  sendTime: { type: Date, required: true },
  batchSize: { type: Number, required: true, min: 1 },
  smtpConfig: { type: Schema.Types.ObjectId, ref: 'SmtpConfig', required: true },
  status: { type: String, enum: ['Planlandı', 'Gönderildi', 'Kısmen Gönderildi'], default: 'Planlandı' },
  sentAt: { type: Date },
  delay: { type: Number, default: 0 }, // saniye cinsinden, opsiyonel
}, { timestamps: true });

/**
 * Newsletter modelini oluşturur ve dışa aktarır.
 * Bu model, bültenlerin MongoDB'de saklanmasını sağlar.
 */
const Newsletter: Model<INewsletter> = mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter; 