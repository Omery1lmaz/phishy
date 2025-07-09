import Newsletter, { INewsletter } from './Newsletter';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Newsletter (bülten) ile ilgili veri erişim işlemlerini yöneten repository katmanı.
 * Tüm veritabanı işlemleri bu sınıf üzerinden yapılır.
 */
export class NewsletterRepository {
  /**
   * ID'ye göre bülten bulur.
   * @param id Bültenin benzersiz kimliği
   */
  async findById(id: string) {
    return Newsletter.findById(id);
  }

  /**
   * Filtreye göre bülten(ler) bulur.
   * @param filter Arama filtresi
   */
  async find(filter: FilterQuery<INewsletter> = {}) {
    return Newsletter.find(filter);
  }

  /**
   * Yeni bir bülten oluşturur.
   * @param data Bülten verisi
   */
  async create(data: Partial<INewsletter>) {
    return Newsletter.create(data);
  }

  /**
   * Bülteni günceller.
   * @param id Bülten kimliği
   * @param update Güncellenecek alanlar
   */
  async update(id: string, update: UpdateQuery<INewsletter>) {
    return Newsletter.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Bülteni siler.
   * @param id Bülten kimliği
   */
  async delete(id: string) {
    return Newsletter.findByIdAndDelete(id);
  }
} 