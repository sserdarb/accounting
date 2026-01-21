'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Shield, BarChart3, Camera, Mail, Smartphone, Database, Check } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'E-Fatura Entegrasyonu',
      description: 'GİB e-Fatura sistemi ile tam entegrasyon. E-Fatura kesme, gönderme ve takip işlemlerini tek platformdan yönetin.',
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'OCR ile Fatura Tanıma',
      description: 'Fatura fotoğraflarını yükleyin, yapay zeka firma adı, VKN, tarih ve tutar bilgilerini anında tanısın.',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Gmail Entegrasyonu',
      description: 'Gmail hesabınızı bağlayın, gelen e-postaları otomatik tarayın ve fatura içeren dosyaları sisteme işleyin.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Fatura Yönetimi',
      description: 'Alış ve satış faturalarını kolayca oluşturun. KDV, stopaj ve diğer vergi hesaplamaları sistem tarafından otomatik yapılır.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Detaylı Raporlama',
      description: 'Gelir-gider raporları, KDV özetleri ve nakit akışı analizleri. Tek tıkla Excel veya PDF formatında dışa aktarın.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'KVKK Uyumlu Güvenlik',
      description: 'Verileriniz KVKK standartlarına uygun olarak şifrelenir. Üst düzey güvenlik protokolleri ile işiniz güvende.',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobil Uyumluluk',
      description: 'Tam responsive tasarım ile mobil cihazlardan fatura kesin. Kamera ile anlık yükleme ve offline çalışma desteği.',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Cari Hesap Yönetimi',
      description: 'Müşteri ve tedarikçi cari hesaplarını efektif yönetin. Vade hatırlatıcıları ile ödemelerinizi asla kaçırmayın.',
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-40 bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white tracking-tight">
            İşinizi <span className="text-blue-400">Geliştiren</span> Güçlü Özellikler
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            Dijital dönüşümün tüm avantajlarını tek bir platformda birleştirdik.
            Zaman kazanın, hataları sıfırlayın ve verimliliğinizi maksimize edin.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-1">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlight Section */}
        <div className="mt-32 p-8 lg:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="h-64 w-64 text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white tracking-tight">Kurumsal Çözümlerde Lider</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'E-Arşiv Fatura Arşivi',
                  'Otomatik E-Fatura Alımı',
                  'Fatura Durumu Takibi',
                  'Özel Tasarım Şablonlar',
                  'Akıllı PDF Yazdırma',
                  'Toplu Veri İşleme',
                  'Anlık Bildirimler',
                  'Gelişmiş Admin Paneli'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-300">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { label: 'Mutlu Müşteri', value: '10K+' },
                  { label: 'İşlenen Fatura', value: '500K+' },
                  { label: 'Uptime', value: '%99.9' },
                  { label: 'Desteğimiz', value: '7/24' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center group hover:border-blue-500/30 transition-all">
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
