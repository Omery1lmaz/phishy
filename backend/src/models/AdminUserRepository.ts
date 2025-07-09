import AdminUser, { IAdminUser } from './AdminUser';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * AdminUser (yönetici kullanıcısı) ile ilgili veri erişim işlemlerini yöneten repository katmanı.
 * Tüm veritabanı işlemleri bu sınıf üzerinden yapılır.
 */
export class AdminUserRepository {
  /**
   * ID'ye göre yönetici bulur.
   * @param id Yönetici kimliği
   */
  async findById(id: string) {
    return AdminUser.findById(id);
  }

  /**
   * Filtreye göre yönetici(ler) bulur.
   * @param filter Arama filtresi
   */
  async find(filter: FilterQuery<IAdminUser> = {}) {
    return AdminUser.find(filter);
  }

  /**
   * Yeni bir yönetici oluşturur.
   * @param data Yönetici verisi
   */
  async create(data: Partial<IAdminUser>) {
    return AdminUser.create(data);
  }

  /**
   * Yöneticiyi günceller.
   * @param id Yönetici kimliği
   * @param update Güncellenecek alanlar
   */
  async update(id: string, update: UpdateQuery<IAdminUser>) {
    return AdminUser.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Yöneticiyi siler.
   * @param id Yönetici kimliği
   */
  async delete(id: string) {
    return AdminUser.findByIdAndDelete(id);
  }
} 