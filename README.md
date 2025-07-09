# Newsletter System (phishy)

Bu proje, modern bir bülten (newsletter) yönetim sistemi sunar. Kullanıcılar ve yöneticiler için ayrı arayüzler, güçlü bir backend API, job queue ile zamanlanmış e-posta gönderimi ve Docker ile kolay kurulum sunar.

---

## Genel Mimari
- **Backend:** Node.js (TypeScript), Express, BullMQ (Redis), JWT, MongoDB, SMTP
- **User Frontend:** React (Vite), kullanıcılar için bülten görüntüleme ve kayıt/giriş
- **Admin Panel:** React (Vite), yöneticiler için bülten ve SMTP yönetimi
- **Docker Compose:** Tüm servisleri tek komutla ayağa kaldırır

---

## Klasör Yapısı
- `backend/`                → RESTful API, job queue, authentication, loglama
- `newsletter-frontend/`    → Kullanıcı arayüzü (React)
- `newsletter-admin-panel/` → Yönetici paneli (React)
- `docker-compose.yml`      → Tüm sistemi başlatmak için
- `.gitignore`              → Gereksiz dosyalar için
- `README.md`               → Genel dokümantasyon (bu dosya)

---

## Hızlı Başlangıç (Docker Compose ile)

1. **Ortam Değişkenleri:**
   - Kök dizinde `.env` dosyası oluşturun ve backend için gerekli değişkenleri ekleyin (örnek için `backend/README.md`'ye bakın).
   - Frontendler için de `.env` dosyası oluşturabilirsiniz (örnek için ilgili klasörlerin README'lerine bakın).

2. **Tüm sistemi başlatın:**
   ```bash
   docker-compose up --build
   ```
   - Backend: `localhost:3001`
   - User Frontend: `localhost:5173`
   - Admin Panel: `localhost:5174`
   - Redis ve diğer servisler otomatik başlar

---

## Ana İş Akışları
- **Kullanıcılar:**
  - Kayıt olur, giriş yapar, gönderilmiş bültenleri görüntüler
- **Yöneticiler:**
  - Admin panelden bülten oluşturur, düzenler, siler, SMTP ayarlarını yönetir
- **Bülten Gönderimi:**
  - Zamanlanmış veya anlık gönderimler BullMQ ile job queue'ya eklenir, worker'lar tarafından işlenir
- **SMTP:**
  - Her kullanıcı/admin kendi SMTP ayarını ekleyebilir
- **Loglama:**
  - Backend'de tüm önemli işlemler ve hatalar loglanır

---

## Kısa Klasör Açıklamaları

### backend/
- API, authentication, job queue, loglama, SMTP işlemleri burada
- Detaylı bilgi için: `backend/README.md`

### newsletter-frontend/
- Kullanıcılar için React tabanlı arayüz
- Detaylı bilgi için: `newsletter-frontend/README.md`

### newsletter-admin-panel/
- Yöneticiler için React tabanlı panel
- Detaylı bilgi için: `newsletter-admin-panel/README.md`

---

## Geliştirici Modunda Çalıştırmak
Her klasörün kendi README dosyasında detaylı kurulum ve geliştirme adımları vardır. Kısaca:

```bash
cd backend && npm install && npm run dev
cd newsletter-frontend && npm install && npm run dev
cd newsletter-admin-panel && npm install && npm run dev
```

---

## Katkı ve Destek
- PR ve issue açmadan önce kodunuzu test edin.
- Kod stiline ve mevcut dosya yapısına uyum sağlayın.
- Sorularınız için ilgili klasörlerin README dosyalarına bakabilirsiniz.

---

## Lisans
MIT
