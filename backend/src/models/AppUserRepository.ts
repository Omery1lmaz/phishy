import AppUser, { IAppUser } from './AppUser';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * AppUser (uygulama kullanıcısı) ile ilgili veri erişim işlemlerini yöneten repository katmanı.
 * Tüm veritabanı işlemleri bu sınıf üzerinden yapılır.
 */
export class AppUserRepository {
  /**
   * ID'ye göre kullanıcı bulur.
   * @param id Kullanıcı kimliği
   */
  async findById(id: string) {
    return AppUser.findById(id);
  }

  /**
   * Filtreye göre kullanıcı(lar) bulur.
   * @param filter Arama filtresi
   */
  async find(filter: FilterQuery<IAppUser> = {}) {
    return AppUser.find(filter);
  }

  /**
   * Yeni bir kullanıcı oluşturur.
   * @param data Kullanıcı verisi
   */
  async create(data: Partial<IAppUser>) {
    return AppUser.create(data);
  }

  /**
   * Kullanıcıyı günceller.
   * @param id Kullanıcı kimliği
   * @param update Güncellenecek alanlar
   */
  async update(id: string, update: UpdateQuery<IAppUser>) {
    return AppUser.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Kullanıcıyı siler.
   * @param id Kullanıcı kimliği
   */
  async delete(id: string) {
    return AppUser.findByIdAndDelete(id);
  }
} 