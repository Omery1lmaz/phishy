import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Uygulama kullanıcısının arayüzü. Mongoose ile uyumlu.
 */
export interface IAppUser extends Document {
  /** Kullanıcının e-posta adresi */
  email: string;
  /** Kullanıcının hashlenmiş şifresi */
  password: string;
  /** Kullanıcı kaydının oluşturulma zamanı */
  createdAt: Date;
  /** Kullanıcı kaydının güncellenme zamanı */
  updatedAt: Date;
}

/**
 * AppUser ana şeması. Uygulama kullanıcılarının temel bilgilerini içerir.
 */
const AppUserSchema = new Schema<IAppUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

/**
 * AppUser modelini oluşturur ve dışa aktarır.
 * Bu model, uygulama kullanıcılarının MongoDB'de saklanmasını sağlar.
 */
const AppUser: Model<IAppUser> = mongoose.model<IAppUser>('AppUser', AppUserSchema);

export default AppUser; 