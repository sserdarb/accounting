'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star, ShieldCheck, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Başlangıç',
      description: 'Küçük işletmeler için tam çözüm',
      price: { monthly: 199, annual: 1990 },
      features: [
        'Aylık 50 e-Fatura',
        'GİB Tam Entegrasyon',
        'Temel Raporlama',
        'PDF Fatura Çıktısı',
        'E-posta Desteği',
        '1 Kullanıcı Lisansı',
      ],
      cta: 'Ücretsiz Dene',
      popular: false,
    },
    {
      name: 'Profesyonel',
      description: 'Büyüyen işletmelerin tercihi',
      price: { monthly: 499, annual: 4990 },
      features: [
        'Aylık 500 e-Fatura',
        'GİB Tam Entegrasyon',
        'Yapay Zeka OCR Tanıma',
        'Gmail Otomatik Tarama',
        'Detaylı Muhasebe Raporu',
        'Excel/PDF Veri Aktarımı',
        '5 Kullanıcı Lisansı',
        'Öncelikli Teknik Destek',
      ],
      cta: 'Ücretsiz Dene',
      popular: true,
    },
    {
      name: 'Kurumsal',
      description: 'Büyük ölçekli operasyonlar için',
      price: { monthly: 1499, annual: 14990 },
      features: [
        'Sınırsız e-Fatura',
        'GİB Tam Entegrasyon',
        'Gelişmiş OCR ve AI',
        'Sınırsız Gmail Bağlantısı',
        'Tam API Erişimi',
        'Özel BI Raporlama',
        'Sınırsız Kullanıcı',
        '7/24 Telefon Desteği',
        'Özel ERP Entegrasyonu',
      ],
      cta: 'İletişime Geç',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-40 bg-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">İhtiyacınıza Uygun <span className="text-blue-400">Şeffaf</span> Fiyatlar</h2>
          <p className="text-xl text-slate-400 mb-10">
            İşletmenizin ölçeğine göre hazırladığımız esnek paketlerimizi inceleyin.
            Gizli ücret yok, 14 gün boyunca tüm özellikleri ücretsiz deneyin.
          </p>

          {/* Billing Toggle - Modern Style */}
          <div className="inline-flex items-center p-1.5 bg-slate-800 rounded-2xl border border-white/5 shadow-2xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isAnnual ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              Yıllık
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                %17 Tasarruf
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 backdrop-blur-md border-white/10 overflow-hidden group transition-all duration-500 ${plan.popular
                  ? 'border-blue-500/50 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] lg:scale-110 z-20 bg-white/[0.08]'
                  : 'hover:border-white/20 z-10'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></div>
                </div>
              )}

              <CardHeader className="pb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl font-black text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">{plan.description}</CardDescription>
                  </div>
                  {plan.popular && <Star className="h-6 w-6 text-blue-400 fill-blue-400" />}
                </div>
                <div className="flex items-baseline gap-1 mt-6">
                  <span className="text-5xl font-black text-white">
                    ₺{isAnnual ? Math.floor(plan.price.annual / 12) : plan.price.monthly}
                  </span>
                  <span className="text-slate-500 font-bold">/ay</span>
                </div>
                {isAnnual && (
                  <div className="text-xs font-bold text-blue-400/80 mt-2 uppercase tracking-widest">
                    Yıllık ₺{plan.price.annual.toLocaleString()} faturalandırılır
                  </div>
                )}
              </CardHeader>

              <CardContent className="pb-8 border-t border-white/5 mt-4 pt-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 group/item">
                      <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-blue-500 transition-colors duration-300">
                        <Check className="h-3 w-3 text-blue-400 group-hover/item:text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full py-8 text-lg font-black rounded-2xl transition-all duration-300 ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Security Trust Badge */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-12 text-slate-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-500/50" />
            <span className="text-sm font-bold uppercase tracking-widest">KVKK ve GİB Uyumlu Veri Sertifikası</span>
          </div>
          <div className="flex items-center gap-6 opacity-40 grayscale contrast-125">
            {/* Mock Logolar */}
            <div className="text-xl font-black tracking-tighter">MCMASTER</div>
            <div className="text-xl font-black tracking-tighter">NORTON</div>
            <div className="text-xl font-black tracking-tighter">TRUSTe</div>
          </div>
        </div>

        {/* Mini FAQ */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <HelpCircle className="h-6 w-6 text-blue-400" />
            <h3 className="text-3xl font-black text-white">Sıkça Sorulan Sorular</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Ücretsiz deneme süresinde kart gerekir mi?',
                a: 'Hayır, 14 gün boyunca kart bilgisi girmeden tüm özellikleri test edebilirsiniz.',
              },
              {
                q: 'Paketimi dilediğim zaman değiştirebilir miyim?',
                a: 'Kesinlikle. İşletmeniz büyüdükçe paketinizi dilediğiniz an yükseltebilirsiniz.',
              },
              {
                q: 'Verilerimiz nerede saklanıyor?',
                a: 'Tüm verileriniz Türkiye sınırlarındaki KVKK uyumlu güvenli veri merkezlerinde şifreli olarak barındırılır.',
              },
              {
                q: 'GİB aktivasyonu ne kadar sürer?',
                a: 'Onaylı entegratörümüz aracılığıyla ortalama 1 iş günü içinde aktivasyon tamamlanır.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                <h4 className="text-white font-bold mb-3">{faq.q}</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
