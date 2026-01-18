# Türkiye E-Fatura Entegrasyonlu Ön Muhasebe Sistemi

Türkiye'deki firmalar için kapsamlı bir ön muhasebe ve e-fatura yönetim sistemi.

## 🚀 Özellikler

### E-Fatura Entegrasyonu
- GİB (Gelir İdaresi Başkanlığı) e-Fatura API entegrasyonu
- E-Arşiv fatura oluşturma ve erşivine erişim
- Gelen e-faturaları otomatik alma
- Fatura durumu takibi (gönderildi, okundu, kabul edildi, reddedildi)

### Fatura Yönetimi
- Alış ve satış faturaları oluşturma
- Fatura şablonları ve özelleştirme
- Geçmiş faturaları görüntüleme, filtreleme ve arama
- Fatura düzenleme ve iptal işlemleri
- KDV, stopaj ve diğer vergi hesaplamaları
- Fatura PDF çıktısı ve yazdırma

### Akıllı Fatura Tanıma (OCR)
- Mobil ve web üzerinden fatura fotoğrafı/görsel yükleme
- OCR teknolojisi ile fatura bilgilerini otomatik okuma
- Firma adı, vergi numarası, tarih, tutar, KDV gibi bilgileri tanıma
- Manuel düzeltme imkanı
- Toplu fatura yükleme desteği

### E-posta Entegrasyonu
- Sisteme özel Gmail hesabı bağlama
- Gelen e-postaların otomatik taranması
- E-posta eklerindeki faturaları (PDF, resim) tespit etme
- Fatura içeren e-postaları otomatik işleme
- İçerikten fatura bilgisi çıkarma (parsing)

### Mobil Uyumluluk
- Tam responsive tasarım
- Mobil cihazlardan kolay kullanım
- Kamera ile fatura çekme ve anında yükleme
- Push notification desteği (fatura bildirimleri)
- Offline mod desteği (temel işlemler için)

### Admin Panel
- Kullanıcı yönetimi (ekleme, silme, yetkilendirme)
- Firma bilgileri yönetimi
- E-fatura entegrasyon ayarları
- Gmail bağlantı ayarları
- Şirket logosu ve fatura şablonu özelleştirme
- Vergi oranları ve parametre ayarları
- Sistem logları ve hata takibi
- Raporlama ve istatistikler
- Yedekleme ve geri yükleme

### Raporlama ve Analiz
- Gelir-gider raporları
- Aylık/yıllık fatura özetleri
- KDV raporları
- Müşteri/tedarikçi bazlı analizler
- Nakit akışı raporları
- Grafik ve görselleştirmeler
- Excel/PDF export

### Ön Muhasebe İşlemleri
- Cari hesap yönetimi
- Tahsilat ve ödeme takibi
- Vade takibi ve hatırlatıcılar
- Banka hesap hareketleri
- Kasa yönetimi
- Basit gelir-gider tablosu

## 🛠️ Teknik Gereksinimler

### Frontend
- Next.js 16 ile modern React uygulaması
- TypeScript ile tip güvenliği
- Tailwind CSS ile hızlı stil
- shadcn/ui component kütüphanesi
- PWA (Progressive Web App) desteği
- Performans odaklı geliştirme

### Güvenlik
- HTTPS zorunluluğu
- JWT token authentication
- Veri şifreleme
- KVKK uyumlu veri yönetimi
- XSS ve CSRF koruması
- Rate limiting

### Kullanıcı Deneyimi
- Türkçe dil desteği
- Kolay ve sezgisel arayüz
- Hızlı yükleme süreleri
- Hata mesajları ve yönlendirmeler
- Yardım ve ipuçları
- Onboarding (ilk kullanım) rehberi

### Entegrasyonlar
- GİB e-Fatura API
- Gmail API
- OCR servisi (Google Vision API veya Tesseract)
- SMS/E-posta bildirimleri
- Ödeme gateway (iyzico, PayTR)

## 📦 Proje Yapısı

```
e-fatura-sistemi/
├── public/                 # Statik dosyalar
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   │   ├── page.tsx          # Ana sayfa (Landing)
│   │   ├── login/           # Giriş sayfası
│   │   ├── register/        # Kayıt sayfası
│   │   ├── dashboard/       # Dashboard
│   │   │   ├── invoices/     # Fatura yönetimi
│   │   │   ├── contacts/      # Cari hesaplar
│   │   │   ├── bank/          # Banka & Kasa
│   │   │   ├── reports/       # Raporlar
│   │   │   ├── ocr/           # OCR fatura okuma
│   │   │   ├── email/         # E-posta entegrasyonu
│   │   │   └── settings/      # Ayarlar
│   │   └── admin/           # Admin panel
│   ├── api/               # API route'ları
│   │   ├── auth/           # Authentication API
│   │   ├── invoices/       # Fatura API
│   │   ├── contacts/       # Cari hesap API
│   │   ├── gib/            # GİB API test
│   │   └── gmail/          # Gmail API test
│   ├── components/
│   │   ├── ui/            # shadcn/ui bileşenleri
│   │   ├── dashboard/      # Dashboard bileşenleri
│   │   └── landing/       # Landing page bileşenleri
│   ├── lib/
│   │   ├── auth.ts         # JWT token işlemleri
│   │   ├── mongodb.ts       # MongoDB bağlantısı
│   │   ├── gib.ts          # GİB API servisi
│   │   ├── gmail.ts         # Gmail API servisi
│   │   ├── ocr.ts          # OCR servisi
│   │   ├── export.ts       # PDF/Excel export
│   │   └── utils.ts        # Yardımcı fonksiyonları
│   ├── models/
│   │   ├── User.ts          # Kullanıcı modeli
│   │   ├── Company.ts       # Şirket modeli
│   │   ├── Invoice.ts      # Fatura modeli
│   │   └── Contact.ts      # Cari hesap modeli
│   ├── types/
│   │   └── index.ts        # TypeScript tipleri
│   ├── middleware.ts          # Authentication middleware
│   ├── .env                 # Ortam değişkenleri
│   ├── .gitignore          # Git ignore dosyası
│   ├── next.config.ts       # Next.js konfigürasyonu
│   ├── tsconfig.json        # TypeScript konfigürasyonu
│   ├── package.json         # Bağımlılıklar
│   ├── postcss.config.mjs  # Tailwind CSS konfigürasyonu
│   ├── docker-compose.yml  # Docker konfigürasyonu
│   └── deploy.sh           # Deployment script
└── README.md             # Bu dosya
```

## 🚀 Kurulum ve Kullanım

### Yerel Geliştirme

1. **Bağımlılıkları Yükleme**
   ```bash
   cd e-fatura-sistemi
   npm install
   ```

2. **Ortam Değişkenleri Ayarlama**
   
   `.env` dosyasını oluşturun ve şu değerleri düzenleyin:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/efatura
   
   # JWT Secret
   JWT_SECRET=guvenli-anahtar-buraya-yazin
   
   # GIB API Settings
   GIB_API_URL=https://efatura-test.gib.gov.tr
   GIB_API_USERNAME=your-gib-username
   GIB_API_PASSWORD=your-gib-password
   GIB_API_ALIAS=your-gib-alias
   
   # Gmail API Settings
   GMAIL_CLIENT_ID=your-gmail-client-id
   GMAIL_CLIENT_SECRET=your-gmail-client-secret
   GMAIL_REDIRECT_URI=http://localhost:7080/api/auth/google/callback
   
   # OCR Service Settings
   OCR_SERVICE_URL=https://vision.googleapis.com/v1/images:annotate
   OCR_API_KEY=your-ocr-api-key
   
   # App Settings
   NEXT_PUBLIC_APP_URL=http://localhost:7080
   NEXT_PUBLIC_APP_NAME=E-Fatura Sistemi
   
   # Server Port
   PORT=7080
   ```

3. **Geliştirme Sunucusunu Başlatma**
   ```bash
   cd e-fatura-sistemi
   npm run dev
   ```
   
   Sistem şu adreste çalışacaktır: http://localhost:7080

4. **MongoDB Başlatma** (eğer yerel MongoDB kullanıyorsanız)
   ```bash
   # Windows
   mongod --dbpath C:\data\db
   
   # Linux/Mac
   sudo systemctl start mongodb
   ```

### Sunucuya Deployment

#### Yöntem 1: SSH ile Manuel Deployment

1. **Deployment Script'i Özelleştirin**
   
   `deploy.sh` dosyasını açın ve şu bilgileri düzenleyin:
   ```bash
   # Sunucu bilgileri
   SERVER_USER="kullanici"           # SSH kullanıcı adınız
   SERVER_IP="sunucu-ip-adresi"    # Sunucu IP adresi
   SERVER_PATH="/var/www/accounting.innovmar.cloud"  # Proje yolu sunucuda
   SSH_KEY="$HOME/.ssh/id_rsa"         # SSH anahtar yolu
   
   # GitHub repository
   GITHUB_REPO="KULLANICI_ADINIZ/e-fatura-sistemi.git"  # GitHub repository adınız
   GITHUB_BRANCH="main"                         # Branch adı
   ```

2. **Script'i Sunucuya Yükleme**
   ```bash
   scp deploy.sh kullanici@sunucu-ip-adresi:/home/kullanici/
   ```

3. **Deployment Script'ini Çalıştırma**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

#### Yöntem 2: Docker ile Deployment

1. **Docker Compose Dosyasını Özelleştirin**
   
   `docker-compose.yml` dosyası zaten projeye dahil edilmiştir. İhtiyacınıza göre düzenleyin:
   ```yaml
   version: '3.8'
   
   services:
     e-fatura-sistemi:
       build: .
       ports:
         - "7080:7080"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=mongodb://mongodb:27017/efatura
         - JWT_SECRET=guvenli-anahtar-buraya-yazin
         - GIB_API_URL=https://efatura-test.gib.gov.tr
         - GIB_API_USERNAME=test-user
         - GIB_API_PASSWORD=test-password
         - GIB_API_ALIAS=test-alias
         - GMAIL_CLIENT_ID=your-gmail-client-id
         - GMAIL_CLIENT_SECRET=your-gmail-client-secret
         - GMAIL_REDIRECT_URI=http://localhost:7080/api/auth/google/callback
         - OCR_SERVICE_URL=https://vision.googleapis.com/v1/images:annotate
         - OCR_API_KEY=your-ocr-api-key
         - NEXT_PUBLIC_APP_URL=http://localhost:7080
         - NEXT_PUBLIC_APP_NAME=E-Fatura Sistemi
       restart: unless-stopped
       networks:
         - app-network
   
     mongodb:
       image: mongo:latest
       ports:
         - "27017:27017"
       volumes:
         - mongodb_data:/data/db
       networks:
         - app-network
   
   volumes:
     mongodb_data:
   ```

2. **Docker ile Başlatma**
   ```bash
   docker-compose up -d
   ```

#### Yöntem 3: Coolify Deployment (Önerilen - SSH Gerektirmez)

1. **GitHub Repository Oluşturun**
   - [GitHub.com](https://github.com/new) adresine gidin
   - Repository name alanına `e-fatura-sistemi` yazın
   - Repository'yi "Public" yapın (veya Private isterseniz)
   - "Initialize this repository with a README" seçeneğini işaretleyin
   - "Create repository" butonuna tıklayın

2. **GitHub'a Push Etme**
   ```bash
   cd e-fatura-sistemi
   git remote add origin https://github.com/KULLANICI_ADINIZ/e-fatura-sistemi.git
   git branch -M main
   git push -u origin main
   ```

3. **Coolify Dashboard'a Bağlanma**
   - [Coolify Dashboard](https://dashboard.coolify.com) adresine gidin
   - GitHub repository'nizi bağlayın
   - `accounting.innovmar.cloud` subdomain'ini belirtin
   - "Deploy Now" veya "Manual Deploy" seçeneğini seçin
   - Deploy butonuna tıklayın

#### Yöntem 4: Vercel Deployment

1. **Vercel Hesabınıza Gidin**
   - [Vercel](https://vercel.com) hesabınıza gidin
   - "Add New Project" seçeneğini seçin
   - GitHub repository'nizi import edin

2. **Deploy Edin**
   - Deploy butonuna tıklayın

#### Yöntem 5: Netlify Deployment

1. **Netlify Hesabınıza Gidin**
   - [Netlify](https://netlify.com) hesabınıza gidin
   - "New site from Git" seçeneğini seçin
   - GitHub repository'nizi bağlayın

2. **Deploy Edin**
   - Deploy butonuna tıklayın

#### Yöntem 6: Railway Deployment

1. **Railway Hesabınıza Gidin**
   - [Railway](https://railway.app) hesabınıza gidin
   - "New Project" seçeneğini seçin
   - GitHub repository'nizi bağlayın
   - Dockerfile ve docker-compose.yml kullanarak deploy edin

## 📊 Sistem Durumu

**Şu Anda Çalışıyor:**
- Geliştirme sunucusu: http://localhost:7080
- Git repository: Hazır (ilk commit oluşturuldu)

**Tamamlanan Özellikler:**
- ✅ Landing page (Hero, Features, Pricing, FAQ, Contact, Footer)
- ✅ Kayıt ve giriş sayfaları
- ✅ Dashboard ana sayfası
- ✅ Fatura yönetimi (liste, oluşturma)
- ✅ Raporlama sayfası (Gelir-Gider, KDV, Müşteri, Nakit Akışı)
- ✅ Cari hesap yönetimi
- ✅ Banka ve Kasa hesapları
- ✅ OCR fatura okuma sayfası
- ✅ E-posta entegrasyonu sayfası
- ✅ Ayarlar sayfası (Profil, Şirket, Entegrasyonlar, Bildirimler, Güvenlik)
- ✅ Admin paneli (Kullanıcılar, Şirketler, Sistem ayarları, Loglar)
- ✅ Authentication sistemi (JWT, bcrypt)
- ✅ MongoDB modelleri (User, Company, Invoice, Contact)
- ✅ API route'ları (Auth, Invoices, Contacts, GİB, Gmail)
- ✅ PDF ve Excel export fonksiyonelliği
- ✅ Recharts grafik bileşenleri (Gelir-Gider, KDV, Nakit Akışı)
- ✅ GİB API entegrasyonu (simülasyon hazır)
- ✅ Gmail API entegrasyonu (simülasyon hazır)
- ✅ OCR servisi (Google Vision/Tesseract desteği)
- ✅ Middleware authentication (devre dışı bıraklı)
- ✅ Git repository başlatıldı
- ✅ Deployment script oluşturuldu
- ✅ Docker Compose konfigürasyonu oluşturuldu

## 📝 Lisans

Bu proje eğitim ve geliştirme amaçlıdır. Üretim kullanımı için GİB resmi API'sine kayıt olmanız ve gerekli lisansları almanız gerekmektedir.

## 🤝 Destek

Herhangi bir sorun için lütfen GitHub repository'sindeki issues bölümünü kullanın veya yeni bir issue oluşturun.

## 📧 İletişim

- GitHub Issues: https://github.com/KULLANICI_ADINIZ/e-fatura-sistemi/issues
- E-posta: destek@efatura-sistemi.com

## 🔐 Güvenlik Notları

- Bu sistem KVKK uyumlu olarak tasarlanmıştır
- Tüm hassas veriler şifrelenmiş şekilde saklanmalıdır
- Güvenli HTTPS kullanın (üretim ortamında)
- JWT token'ların süresi 7 gündür
- Şifreler en az 8 karakter olmalıdır
- API route'ları rate limiting ile korunmalıdır

---

**Türkiye E-Fatura Entegrasyonlu Ön Muhasebe Sistemi** © 2024
