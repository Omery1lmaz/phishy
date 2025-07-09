import { AppUserRepository } from './AppUserRepository';
import { IAppUser } from './AppUser';
import { FilterQuery } from 'mongoose';

/**
 * AppUser (uygulama kullanıcısı) ile ilgili iş mantığını yöneten servis katmanı.
 * Controller/route katmanı sadece bu servis ile iletişim kurar.
 */
export class AppUserService {
  private repository: AppUserRepository;

  constructor(repository?: AppUserRepository) {
    this.repository = repository || new AppUserRepository();
  }

  /**
   * ID'ye göre kullanıcı getirir.
   * @param id Kullanıcı kimliği
   */
  async getUserById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Filtreye göre kullanıcı(lar) getirir.
   * @param filter Arama filtresi
   */
  async getUsers(filter: FilterQuery<IAppUser> = {}) {
    return this.repository.find(filter);
  }

  /**
   * Yeni kullanıcı oluşturur.
   * @param data Kullanıcı verisi
   */
  async createUser(data: Partial<IAppUser>) {
    // Ek iş kuralları eklenebilir (ör: validasyon, loglama, vs.)
    return this.repository.create(data);
  }

  /**
   * Kullanıcıyı günceller.
   * @param id Kullanıcı kimliği
   * @param update Güncellenecek alanlar
   */
  async updateUser(id: string, update: Partial<IAppUser>) {
    // Ek iş kuralları eklenebilir
    return this.repository.update(id, update);
  }

  /**
   * Kullanıcıyı siler.
   * @param id Kullanıcı kimliği
   */
  async deleteUser(id: string) {
    return this.repository.delete(id);
  }
} 