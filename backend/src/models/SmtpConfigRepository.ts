import SmtpConfig, { ISmtpConfig } from './SmtpConfig';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * SmtpConfig (SMTP yapılandırması) ile ilgili veri erişim işlemlerini yöneten repository katmanı.
 * Tüm veritabanı işlemleri bu sınıf üzerinden yapılır.
 */
export class SmtpConfigRepository {
  /**
   * ID'ye göre SMTP yapılandırması bulur.
   * @param id Yapılandırma kimliği
   */
  async findById(id: string) {
    return SmtpConfig.findById(id);
  }

  /**
   * Filtreye göre SMTP yapılandırması(ları) bulur.
   * @param filter Arama filtresi
   */
  async find(filter: FilterQuery<ISmtpConfig> = {}) {
    return SmtpConfig.find(filter);
  }

  /**
   * Yeni bir SMTP yapılandırması oluşturur.
   * @param data Yapılandırma verisi
   */
  async create(data: Partial<ISmtpConfig>) {
    return SmtpConfig.create(data);
  }

  /**
   * SMTP yapılandırmasını günceller.
   * @param id Yapılandırma kimliği
   * @param update Güncellenecek alanlar
   */
  async update(id: string, update: UpdateQuery<ISmtpConfig>) {
    return SmtpConfig.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * SMTP yapılandırmasını siler.
   * @param id Yapılandırma kimliği
   */
  async delete(id: string) {
    return SmtpConfig.findByIdAndDelete(id);
  }
} 