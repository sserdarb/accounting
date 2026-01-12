'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Shield, BarChart3, Camera, Mail, Smartphone, Database } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'GİB E-Fatura Entegrasyonu',
      description: 'Gelir İdaresi Başkanlığı e-Fatura sistemi ile tam entegrasyon. E-Fatura kesme, gönderme ve takip işlemlerini tek platformdan yönetin.',
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'OCR ile Fatura Tanıma',
      description: 'Fatura fotoğraflarını yükleyin, sistem otomatik olarak firma adı, vergi numarası, tarih ve tutar bilgilerini tanırsın.',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Gmail Entegrasyonu',
      description: 'Gmail hesabınızı bağlayın, gelen e-postaları otomatik tarayın ve fatura içeren e-postaları sisteme işleyin.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Fatura Yönetimi',
      description: 'Alış ve satış faturalarını kolayca oluşturun, düzenleyin ve yönetin. KDV, stopaj ve diğer vergi hesaplamaları otomatik.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detaylı Raporlama',
      description: 'Gelir-gider raporları, KDV raporları, aylık/yıllık özetler ve daha fazlası. Excel/PDF export desteği.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'KVKK Uyumlu Güvenlik',
      description: 'Verileriniz KVKK standartlarına uygun olarak şifrelenir. HTTPS, JWT authentication ve XSS/CSRF koruması.',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobil Uyumluluk',
      description: 'Tam responsive tasarım ile mobil cihazlardan kolayca erişin. Kamera ile fatura çekme ve offline mod desteği.',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Cari Hesap Yönetimi',
      description: 'Müşteri ve tedarikçi cari hesaplarını yönetin. Tahsilat ve ödeme takibi, vade hatırlatıcıları.',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            İşinizi Yönetmenin En Kolay Yolu
          </h2>
          <p className="text-lg text-muted-foreground">
            Kapsamlı özellikler ile ön muhasebe işlemlerinizi dijital dünyaya taşıyın.
            Zaman kazanın, hataları azaltın ve verimliliğinizi artırın.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Daha Fazla Özellik</h3>
              <ul className="space-y-4">
                {[
                  'E-Arşiv fatura oluşturma ve arşivine erişim',
                  'Gelen e-faturaları otomatik alma ve kaydetme',
                  'Fatura durumu takibi (gönderildi, okundu, kabul edildi, reddedildi)',
                  'Fatura şablonları ve özelleştirme',
                  'PDF çıktısı ve yazdırma desteği',
                  'Toplu fatura yükleme ve işleme',
                  'Push notification desteği',
                  'Admin panel ve kullanıcı yönetimi',
                  'Yedekleme ve geri yükleme',
                  '7/24 sistem erişilebilirliği',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Mutlu Müşteri</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">500K+</div>
                    <div className="text-sm text-muted-foreground">İşlenen Fatura</div>
                  </div>
                  <div className="bg-background rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">%99.9</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="bg-background rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">7/24</div>
                    <div className="text-sm text-muted-foreground">Destek</div>
                  </div>
                  <div className="bg-background rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">5DK</div>
                    <div className="text-sm text-muted-foreground">Ort. Yanıt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
