import { SmtpConfigRepository } from './SmtpConfigRepository';
import { ISmtpConfig } from './SmtpConfig';
import { FilterQuery } from 'mongoose';

/**
 * SmtpConfig (SMTP yapılandırması) ile ilgili iş mantığını yöneten servis katmanı.
 * Controller/route katmanı sadece bu servis ile iletişim kurar.
 */
export class SmtpConfigService {
  private repository: SmtpConfigRepository;

  constructor(repository?: SmtpConfigRepository) {
    this.repository = repository || new SmtpConfigRepository();
  }

  /**
   * ID'ye göre SMTP yapılandırması getirir.
   * @param id Yapılandırma kimliği
   */
  async getConfigById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Filtreye göre SMTP yapılandırması(ları) getirir.
   * @param filter Arama filtresi
   */
  async getConfigs(filter: FilterQuery<ISmtpConfig> = {}) {
    return this.repository.find(filter);
  }

  /**
   * Yeni SMTP yapılandırması oluşturur.
   * @param data Yapılandırma verisi
   */
  async createConfig(data: Partial<ISmtpConfig>) {
    // Ek iş kuralları eklenebilir (ör: validasyon, loglama, vs.)
    return this.repository.create(data);
  }

  /**
   * SMTP yapılandırmasını günceller.
   * @param id Yapılandırma kimliği
   * @param update Güncellenecek alanlar
   */
  async updateConfig(id: string, update: Partial<ISmtpConfig>) {
    // Ek iş kuralları eklenebilir
    return this.repository.update(id, update);
  }

  /**
   * SMTP yapılandırmasını siler.
   * @param id Yapılandırma kimliği
   */
  async deleteConfig(id: string) {
    return this.repository.delete(id);
  }
} 