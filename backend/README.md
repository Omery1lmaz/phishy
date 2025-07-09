# Newsletter Backend

Bu klasör, bülten (newsletter) sisteminin Node.js (TypeScript) tabanlı backend API'sini içerir.

---

## Genel Mimari
- **Express.js** tabanlı RESTful API
- **JWT** ile kullanıcı ve admin authentication
- **BullMQ** ile e-posta gönderim ve zamanlama işlemleri (Redis tabanlı job queue)
- **MongoDB** ile veri saklama (varsayılan, kendi ORM/ODM'nize göre güncelleyebilirsiniz)
- **SMTP** ile e-posta gönderimi (kullanıcıya özel SMTP ayarı desteği)
- **Loglama**: `winston` ile dosya bazlı loglama

---

## Ana Klasör ve Dosya Yapısı

- `src/controllers/` : API endpoint mantığı (auth, newsletter, smtp vs.)
- `src/models/`      : Veri modelleri ve servisleri
- `src/routes/`      : Express route tanımları
- `src/middleware/`  : Auth, validation, hata yönetimi
- `src/queue/`       : BullMQ job tanımları ve worker'lar
- `src/utils/`       : Yardımcı fonksiyonlar (logger, email doğrulama, SMTP test vs.)
- `src/validators/`  : Request body validation şemaları
- `logs/`            : Uygulama log dosyaları

---

## Ana İş Akışları

### 1. **Kullanıcı ve Admin Authentication**
- JWT tabanlı login/register endpointleri
- `src/middleware/auth.ts` ile route koruması
- Admin ve user rolleri ayrımı

### 2. **Newsletter (Bülten) Yönetimi**
- Bülten oluşturma, listeleme, silme, detay görüntüleme
- Bülten gönderimi için BullMQ ile job oluşturma
- Zamanlanmış gönderimler desteklenir

### 3. **SMTP Yapılandırması**
- Her kullanıcı/admin kendi SMTP ayarını ekleyebilir
- SMTP ayarları doğrulama (`utils/verifySmtpConfig.ts`)
- E-posta gönderiminde ilgili kullanıcının SMTP ayarı kullanılır

### 4. **Job Queue (BullMQ)**
- `src/queue/mailQueue.ts` ile job ekleme
- `src/queue/mailWorker.ts` ve `dynamicNewsletterWorker.ts` ile job işleme
- Job durumları: beklemede, işleniyor, tamamlandı, hata
- Redis gereklidir (docker-compose ile otomatik başlar)

### 5. **Loglama ve Hata Yönetimi**
- `utils/logger.ts` ile winston tabanlı loglama (logs/ altında tutulur)
- Hatalar hem loglanır hem de uygun HTTP response ile döner

---

## API Endpoint Örnekleri

### Auth
- `POST /api/user/register` : Kullanıcı kaydı
- `POST /api/user/login`    : Kullanıcı girişi
- `POST /api/admin/register`: Admin kaydı
- `POST /api/admin/login`   : Admin girişi

### Newsletter
- `GET /api/newsletters`         : Bültenleri listele
- `POST /api/newsletters`        : Yeni bülten oluştur
- `GET /api/newsletters/:id`     : Bülten detayı
- `DELETE /api/newsletters/:id`  : Bülten sil

### SMTP Config
- `GET /api/smtp-configs`        : SMTP ayarlarını listele
- `POST /api/smtp-configs`       : SMTP ayarı ekle/güncelle
- `DELETE /api/smtp-configs/:id` : SMTP ayarını sil

---

## Geliştirme Ortamı

1. **Kurulum**
   ```bash
   cd backend
   npm install
   ```
2. **.env Dosyası**
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=youruser@example.com
   SMTP_PASS=yourpassword
   PORT=3001
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/newsletter
   ```
3. **Başlatma**
   ```bash
   npm run dev
   ```

---

## Production Ortamı & Docker

- **Tek başına backend:**
  ```bash
  docker build -t newsletter-backend .
  docker run --env-file .env -p 3001:3001 newsletter-backend
  ```
- **Tüm sistemi başlatmak için:**
  ```bash
  docker-compose up --build
  ```
  Bu komut backend, frontendler ve redis'i birlikte başlatır.

---

## Loglama
- Tüm loglar `backend/logs/` klasöründe tutulur.
- Hata ve bilgi logları ayrı dosyalara yazılır.

---

## Hata Yönetimi
- API hataları standart JSON formatında döner.
- Tüm hatalar loglanır.

---

## Katkı Rehberi
- PR ve issue açmadan önce lütfen kodunuzu test edin.
- Kod stiline ve mevcut dosya yapısına uyum sağlayın.
- Geliştirme için `dev` branch'ini kullanın.

---

## Ekstra
- **Redis** ve **MongoDB** servislerinin çalışır olduğundan emin olun.
- SMTP ayarlarını test etmek için `utils/verifySmtpConfig.ts` kullanılabilir.
- BullMQ dashboard gibi ek araçlar ile job queue'yu izleyebilirsiniz.
