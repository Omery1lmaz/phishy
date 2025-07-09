import { NewsletterRepository } from './NewsletterRepository';
import { INewsletter } from './Newsletter';
import { FilterQuery } from 'mongoose';

/**
 * Newsletter (bülten) ile ilgili iş mantığını yöneten servis katmanı.
 * Controller/route katmanı sadece bu servis ile iletişim kurar.
 */
export class NewsletterService {
  private repository: NewsletterRepository;

  constructor(repository?: NewsletterRepository) {
    this.repository = repository || new NewsletterRepository();
  }

  /**
   * ID'ye göre bülten getirir.
   * @param id Bülten kimliği
   */
  async getNewsletterById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Filtreye göre bülten(ler) getirir.
   * @param filter Arama filtresi
   */
  async getNewsletters(filter: FilterQuery<INewsletter> = {}) {
    return this.repository.find(filter);
  }

  /**
   * Yeni bülten oluşturur.
   * @param data Bülten verisi
   */
  async createNewsletter(data: Partial<INewsletter>) {
    // Burada ek iş kuralları eklenebilir (ör: validasyon, loglama, vs.)
    return this.repository.create(data);
  }

  /**
   * Bülteni günceller.
   * @param id Bülten kimliği
   * @param update Güncellenecek alanlar
   */
  async updateNewsletter(id: string, update: Partial<INewsletter>) {
    // Ek iş kuralları eklenebilir
    return this.repository.update(id, update);
  }

  /**
   * Bülteni siler.
   * @param id Bülten kimliği
   */
  async deleteNewsletter(id: string) {
    return this.repository.delete(id);
  }
} 