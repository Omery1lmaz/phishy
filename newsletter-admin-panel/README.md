# Newsletter Admin Panel

Bu klasör, bülten sisteminin yönetici panelini içerir. Yöneticiler bültenleri ve SMTP ayarlarını yönetebilir.

## Özellikler
- Admin girişi ve kaydı
- Bülten oluşturma, düzenleme, silme
- SMTP ayarlarını yönetme
- Modern ve responsive arayüz

## Kurulum (Geliştirici Modu)

```bash
cd newsletter-admin-panel
npm install
npm run dev
```

## Ortam Değişkenleri

`.env` dosyası oluşturup API adresini belirtin:

```
VITE_API_URL=http://localhost:3001
```

## Docker ile Çalıştırma

Aşağıdaki komut ile sadece admin paneli Docker ile başlatabilirsiniz:

```bash
docker build -t newsletter-admin-panel .
docker run --env-file .env -p 5174:5174 newsletter-admin-panel
```

Tüm sistemi (backend, user frontend, admin frontend, redis) birlikte başlatmak için kök dizindeki `docker-compose.yml` dosyasını kullanın:

```bash
docker-compose up --build
```

## Notlar
- Admin panel varsayılan olarak 5174 portunda çalışır.
- Backend ve redis servislerinin de çalışıyor olması gerekir (docker-compose ile otomatik başlar).
- Geliştirme ortamında .env dosyasını eksiksiz doldurduğunuzdan emin olun.
