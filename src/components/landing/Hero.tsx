'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const features = [
    { icon: <Zap className="h-5 w-5" />, text: 'GİB E-Fatura Entegrasyonu' },
    { icon: <Shield className="h-5 w-5" />, text: 'KVKK Uyumlu Güvenli Sistem' },
    { icon: <BarChart3 className="h-5 w-5" />, text: 'Detaylı Raporlama' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Türkiye'nin En Kapsamlı Ön Muhasebe Sistemi
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            E-Fatura ve Ön Muhasebe
            <span className="block text-primary">Yönetiminizi Kolaylaştırın</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            GİB e-Fatura entegrasyonu, OCR ile otomatik fatura tanıma, Gmail entegrasyonu ve daha fazlası ile işinizi dijital dünyaya taşıyın.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium"
              >
                <span className="text-primary">{feature.icon}</span>
                {feature.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Ücretsiz Deneyin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                Özellikleri İncele
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground">İşlenen Fatura</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">%99.9</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">7/24</div>
              <div className="text-sm text-muted-foreground">Destek</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative bg-background border rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xs text-muted-foreground">dashboard.efatura.com</div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Mock dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Toplam Gelir</div>
                  <div className="text-2xl font-bold">₺125,430</div>
                  <div className="text-xs text-green-600 mt-1">↑ %12.5 geçen aya göre</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Toplam Gider</div>
                  <div className="text-2xl font-bold">₺42,150</div>
                  <div className="text-xs text-red-600 mt-1">↓ %5.2 geçen aya göre</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Bekleyen Faturalar</div>
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-xs text-muted-foreground mt-1">₺15,800 toplam</div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-3">Son Faturalar</div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">FAT-{2024000 + i}</div>
                          <div className="text-xs text-muted-foreground">ABC Ltd. Şti.</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">₺{(1200 + i * 300).toLocaleString()}</div>
                        <div className="text-xs text-green-600">Ödendi</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
