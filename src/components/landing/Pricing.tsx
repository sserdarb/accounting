'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star } from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Başlangıç',
      description: 'Küçük işletmeler ve yeni başlayanlar için',
      price: { monthly: 199, annual: 1990 },
      features: [
        'Aylık 50 fatura',
        'GİB e-Fatura entegrasyonu',
        'Temel raporlama',
        'PDF fatura çıktısı',
        'E-posta desteği',
        '1 kullanıcı',
      ],
      cta: 'Ücretsiz Dene',
      popular: false,
    },
    {
      name: 'Profesyonel',
      description: 'Büyüyen işletmeler için ideal',
      price: { monthly: 499, annual: 4990 },
      features: [
        'Aylık 500 fatura',
        'GİB e-Fatura entegrasyonu',
        'OCR fatura tanıma',
        'Gmail entegrasyonu',
        'Detaylı raporlama',
        'Excel/PDF export',
        '5 kullanıcı',
        'Öncelikli destek',
      ],
      cta: 'Ücretsiz Dene',
      popular: true,
    },
    {
      name: 'Kurumsal',
      description: 'Büyük şirketler için kapsamlı çözüm',
      price: { monthly: 1499, annual: 14990 },
      features: [
        'Sınırsız fatura',
        'GİB e-Fatura entegrasyonu',
        'OCR fatura tanıma',
        'Gmail entegrasyonu',
        'API erişimi',
        'Özel raporlama',
        'Sınırsız kullanıcı',
        '7/24 telefon desteği',
        'Özel entegrasyonlar',
        'Dedike hesap yöneticisi',
      ],
      cta: 'İletişime Geç',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Size Uygun Paketi Seçin
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Esnek fiyatlandırma seçenekleri ile işletmenizin büyüklüğüne uygun paketi seçin.
            14 gün ücretsiz deneme ile risk yok.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center rounded-lg bg-muted p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual ? 'bg-background shadow' : 'text-muted-foreground'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isAnnual ? 'bg-background shadow' : 'text-muted-foreground'
              }`}
            >
              Yıllık
              <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                %17 İndirim
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-xl scale-105'
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    En Popüler
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ₺{isAnnual ? plan.price.annual / 12 : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground">/ay</span>
                  {isAnnual && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Yıllık ₺{plan.price.annual} faturalandırılır
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>14 gün ücretsiz deneme • Kredi kartı gerekmez • İstediğiniz zaman iptal edin</span>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Sıkça Sorulan Sorular</h3>
          <div className="space-y-4">
            {[
              {
                q: 'Ücretsiz deneme süresinde kredi kartı gerekir mi?',
                a: 'Hayır, ücretsiz deneme süresinde kredi kartı bilgisi istemiyoruz. 14 gün boyunca tüm özellikleri risk almadan deneyebilirsiniz.',
              },
              {
                q: 'Paketi değiştirebilir miyim?',
                a: 'Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklikler anında uygulanır.',
              },
              {
                q: 'Verilerim güvende mi?',
                a: 'Evet, verileriniz KVKK standartlarına uygun olarak şifrelenir ve güvende tutulur. HTTPS, JWT authentication ve XSS/CSRF koruması kullanıyoruz.',
              },
            ].map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline">Tüm Soruları Gör</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
