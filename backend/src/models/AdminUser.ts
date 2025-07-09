import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Yönetici kullanıcısının arayüzü. Mongoose ile uyumlu.
 */
export interface IAdminUser extends Document {
  /** Yöneticinin e-posta adresi */
  email: string;
  /** Yöneticinin hashlenmiş şifresi */
  password: string;
  /** Yönetici kaydının oluşturulma zamanı */
  createdAt: Date;
  /** Yönetici kaydının güncellenme zamanı */
  updatedAt: Date;
}

/**
 * AdminUser ana şeması. Yönetici kullanıcılarının temel bilgilerini içerir.
 */
const AdminUserSchema = new Schema<IAdminUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

/**
 * AdminUser modelini oluşturur ve dışa aktarır.
 * Bu model, yönetici kullanıcılarının MongoDB'de saklanmasını sağlar.
 */
const AdminUser: Model<IAdminUser> = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser; 