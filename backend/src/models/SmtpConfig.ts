import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * SMTP yapılandırmasının arayüzü. Mongoose ile uyumlu.
 */
export interface ISmtpConfig extends Document {
  /** SMTP yapılandırmasının adı */
  name: string;
  /** SMTP sunucu adresi */
  host: string;
  /** SMTP port numarası */
  port: number;
  /** SMTP kullanıcı adı */
  user: string;
  /** SMTP şifresi */
  pass: string;
  /** Yapılandırmanın oluşturulma zamanı */
  createdAt: Date;
  /** Yapılandırmanın güncellenme zamanı */
  updatedAt: Date;
  /** SMTP yapılandırmasının doğrulanma durumu */
  verified: boolean;
}

/**
 * SmtpConfig ana şeması. SMTP yapılandırmalarının temel bilgilerini içerir.
 */
const SmtpConfigSchema = new Schema<ISmtpConfig>({
  name: { type: String, required: true, maxlength: 100 },
  host: { type: String, required: true },
  port: { type: Number, required: true },
  user: { type: String, required: true },
  pass: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

/**
 * SmtpConfig modelini oluşturur ve dışa aktarır.
 * Bu model, SMTP yapılandırmalarının MongoDB'de saklanmasını sağlar.
 */
const SmtpConfig: Model<ISmtpConfig> = mongoose.model<ISmtpConfig>('SmtpConfig', SmtpConfigSchema);

export default SmtpConfig; 