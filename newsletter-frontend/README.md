# Newsletter User Frontend

Bu klasör, bülten sisteminin kullanıcı arayüzünü içerir. Kullanıcılar bültenleri görebilir, giriş yapabilir ve kayıt olabilir.

## Özellikler
- Kullanıcı girişi ve kaydı
- Gönderilmiş bültenleri listeleme ve detay görüntüleme
- Modern ve responsive arayüz

## Kurulum (Geliştirici Modu)

```bash
cd newsletter-frontend
npm install
npm run dev
```

## Ortam Değişkenleri

`.env` dosyası oluşturup API adresini belirtin:

```
VITE_API_URL=http://localhost:3001
```

## Docker ile Çalıştırma

Aşağıdaki komut ile sadece user frontend'i Docker ile başlatabilirsiniz:

```bash
docker build -t newsletter-frontend .
docker run --env-file .env -p 5173:5173 newsletter-frontend
```

Tüm sistemi (backend, user frontend, admin frontend, redis) birlikte başlatmak için kök dizindeki `docker-compose.yml` dosyasını kullanın:

```bash
docker-compose up --build
```

## Notlar
- Frontend varsayılan olarak 5173 portunda çalışır.
- Backend ve redis servislerinin de çalışıyor olması gerekir (docker-compose ile otomatik başlar).
