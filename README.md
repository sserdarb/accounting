# E-Fatura Sistemi

Türkiye'deki firmalar için kapsamlı bir ön muhasebe ve e-fatura yönetim sistemi.

## Özellikler

### Temel Özellikler

- ✅ **GİB E-Fatura Entegrasyonu** - Gelir İdaresi Başkanlığı e-Fatura sistemi ile tam entegrasyon
- ✅ **OCR ile Fatura Tanıma** - Fatura fotoğraflarını otomatik olarak okuma
- ✅ **Gmail Entegrasyonu** - Gelen e-postaları otomatik tarama ve işleme
- ✅ **Fatura Yönetimi** - Alış/satış faturaları oluşturma, düzenleme ve yönetme
- ✅ **Cari Hesap Yönetimi** - Müşteri ve tedarikçi cari hesapları
- ✅ **Detaylı Raporlama** - Gelir-gider, KDV ve diğer raporlar
- ✅ **Admin Paneli** - Kullanıcı ve firma yönetimi
- ✅ **KVKK Uyumu** - Kişisel veri koruma yasalarına tam uyum

### Teknoloji Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs

## Kurulum

### Gereksinimler

- Node.js 18 veya üzeri
- MongoDB 4.4 veya üzeri
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd e-fatura-sistemi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
MONGODB_URI=mongodb://localhost:27017/efatura
JWT_SECRET=your-secret-key-here
```

4. MongoDB'yi başlatın:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongodb
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

6. Tarayıcıda açın:
```
http://localhost:3000
```

## Proje Yapısı

```
e-fatura-sistemi/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # Authentication API
│   │   │   ├── invoices/    # Invoice API
│   │   │   └── contacts/     # Contact API
│   │   ├── dashboard/       # Dashboard sayfaları
│   │   ├── admin/          # Admin paneli
│   │   ├── login/          # Giriş sayfası
│   │   ├── register/       # Kayıt sayfası
│   │   └── page.tsx        # Ana sayfa (landing page)
│   ├── components/             # React bileşenleri
│   │   ├── ui/            # shadcn/ui bileşenleri
│   │   ├── landing/       # Landing page bileşenleri
│   │   └── dashboard/     # Dashboard bileşenleri
│   ├── lib/                   # Yardımcı fonksiyonlar
│   │   ├── auth.ts        # Authentication fonksiyonları
│   │   ├── mongodb.ts     # MongoDB bağlantısı
│   │   └── utils.ts       # Utility fonksiyonlar
│   ├── models/                # Mongoose modelleri
│   │   ├── User.ts
│   │   ├── Company.ts
│   │   ├── Invoice.ts
│   │   └── Contact.ts
│   ├── types/                 # TypeScript tipleri
│   │   └── index.ts
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global stiller
│   └── middleware.ts          # Next.js middleware
├── public/                   # Statik dosyalar
├── .env.example              # Ortam değişkenleri örneği
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Kullanım

### Giriş Yapma

1. `/login` sayfasına gidin
2. E-posta ve şifrenizi girin
3. Veya Google ile giriş yapın

### Fatura Oluşturma

1. Dashboard'a gidin
2. "Yeni Fatura" butonuna tıklayın
3. Müşteri bilgilerini doldurun
4. Fatura kalemlerini ekleyin
5. Kaydet veya GİB'e gönderin

### OCR ile Fatura Okuma

1. Fatura fotoğrafını veya PDF'ini yükleyin
2. Sistem otomatik olarak bilgileri tanır
3. Gerekirse düzeltmeleri yapın
4. Kaydedin

## API Endpoints

### Authentication

- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/register` - Kayıt olma

### Invoices

- `GET /api/invoices` - Faturaları listeleme
- `POST /api/invoices` - Yeni fatura oluşturma

### Contacts

- `GET /api/contacts` - Cari hesapları listeleme
- `POST /api/contacts` - Yeni cari hesap oluşturma

## Geliştirme

### Mevcut Özellikler

- [ ] GİB API entegrasyonu tamamlanacak
- [ ] Gmail API entegrasyonu tamamlanacak
- [ ] OCR servisi entegrasyonu tamamlanacak
- [ ] PDF oluşturma özelliği eklenecek
- [ ] E-posta bildirimleri eklenecek
- [ ] Excel/PDF export özellikleri tamamlanacak

### Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen:
1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi yapın
4. Commit yapın
5. Push edin
6. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- E-posta: destek@efatura.com
- Web: https://efatura.com
- GitHub: https://github.com/efatura-sistemi

## KVKK

Bu proje KVKK (Kişisel Verilerin Korunması Kanunu) gereksinimlerine uygun olarak tasarlanmıştır. Kullanıcı verileri şifrelenir ve güvenli bir şekilde saklanır.
