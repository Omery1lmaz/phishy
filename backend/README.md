# Newsletter Backend

Bu klasör, bülten (newsletter) sisteminin Node.js tabanlı backend API'sini içerir.

## Özellikler
- Kullanıcı ve admin yönetimi (JWT ile kimlik doğrulama)
- SMTP ayarları yönetimi
- Bülten oluşturma, gönderme ve planlama (BullMQ ile job queue)
- RESTful API

## Kurulum (Geliştirici Modu)

```bash
cd backend
npm install
npm run dev
```

## Ortam Değişkenleri

`.env` dosyası oluşturup aşağıdaki gibi doldurun:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=youruser@example.com
SMTP_PASS=yourpassword
PORT=3001
REDIS_URL=redis://redis:6379
```

## Docker ile Çalıştırma

Öncelikle kök dizinde (proje ana klasörü) bir `.env` dosyası oluşturun ve backend için gerekli değişkenleri ekleyin.

Ardından aşağıdaki komut ile backend'i Docker ile başlatabilirsiniz:

```bash
docker build -t newsletter-backend .
docker run --env-file .env -p 3001:3001 newsletter-backend
```

Tüm sistemi (backend, user frontend, admin frontend, redis) birlikte başlatmak için kök dizindeki `docker-compose.yml` dosyasını kullanın:

```bash
docker-compose up --build
```

Bu komut ile backend, frontendler ve redis birlikte ayağa kalkar.

## Notlar
- Backend varsayılan olarak 3001 portunda çalışır.
- Redis servisi gereklidir (docker-compose ile otomatik başlar).
- Frontend uygulamaları için de .env dosyası oluşturulabilir.
