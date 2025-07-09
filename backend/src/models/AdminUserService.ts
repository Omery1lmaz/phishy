import { AdminUserRepository } from './AdminUserRepository';
import { IAdminUser } from './AdminUser';
import { FilterQuery } from 'mongoose';

/**
 * AdminUser (yönetici kullanıcısı) ile ilgili iş mantığını yöneten servis katmanı.
 * Controller/route katmanı sadece bu servis ile iletişim kurar.
 */
export class AdminUserService {
  private repository: AdminUserRepository;

  constructor(repository?: AdminUserRepository) {
    this.repository = repository || new AdminUserRepository();
  }

  /**
   * ID'ye göre yönetici getirir.
   * @param id Yönetici kimliği
   */
  async getAdminById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Filtreye göre yönetici(ler) getirir.
   * @param filter Arama filtresi
   */
  async getAdmins(filter: FilterQuery<IAdminUser> = {}) {
    return this.repository.find(filter);
  }

  /**
   * Yeni yönetici oluşturur.
   * @param data Yönetici verisi
   */
  async createAdmin(data: Partial<IAdminUser>) {
    // Ek iş kuralları eklenebilir (ör: validasyon, loglama, vs.)
    return this.repository.create(data);
  }

  /**
   * Yöneticiyi günceller.
   * @param id Yönetici kimliği
   * @param update Güncellenecek alanlar
   */
  async updateAdmin(id: string, update: Partial<IAdminUser>) {
    // Ek iş kuralları eklenebilir
    return this.repository.update(id, update);
  }

  /**
   * Yöneticiyi siler.
   * @param id Yönetici kimliği
   */
  async deleteAdmin(id: string) {
    return this.repository.delete(id);
  }
} 