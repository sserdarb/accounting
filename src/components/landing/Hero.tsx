'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const features = [
    { icon: <Zap className="h-5 w-5" />, text: 'GİB E-Fatura Entegrasyonu' },
    { icon: <Shield className="h-5 w-5" />, text: 'KVKK Uyumlu Güvenli Sistem' },
    { icon: <BarChart3 className="h-5 w-5" />, text: 'Detaylı Raporlama' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-950 text-white pt-24">
      {/* Dynamic Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4n)] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-medium text-emerald-200 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
            Türkiye'nin En Kapsamlı Ön Muhasebe Sistemi
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
            E-Fatura <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Geleceğini</span>
            <span className="block italic">Bugünden Yaşayın</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-emerald-100/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Yapay zeka destekli OCR, anlık GİB entegrasyonu ve kusursuz mobil deneyim ile işletmenizi büyütmeye odaklanın.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 group">
                Ücretsiz Deneyin
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                Özellikleri İncele
              </Button>
            </Link>
          </div>

          {/* Feature badges with hover effect */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 text-base font-semibold hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 cursor-default"
              >
                <span className="text-emerald-400 group-hover:scale-110 transition-transform">{feature.icon}</span>
                <span className="text-emerald-50/90">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Section with glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="space-y-1">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">10K+</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-widest">Aktif Kullanıcı</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">500K+</div>
              <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-widest">İşlenen Fatura</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">%99.9</div>
              <div className="text-sm font-medium text-blue-200/60 uppercase tracking-widest">Uptime Garantisi</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">7/24</div>
              <div className="text-sm font-medium text-blue-200/60 uppercase tracking-widest">Uzman Destek</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview - Floating Effect */}
        <div className="mt-24 relative max-w-6xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-700 hover:-translate-y-2">
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-red-500/50"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-yellow-500/50"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xs font-mono text-white/30 lowercase tracking-widest">secure-dashboard.innovmar.cloud</div>
              </div>
            </div>
            <div className="p-8 space-y-8">
              {/* Mock dashboard content - Improved UI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Toplam Gelir', value: '₺125,430', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'Toplam Gider', value: '₺42,150', color: 'text-rose-400', bg: 'bg-rose-400/10' },
                  { label: 'Bekleyen Faturalar', value: '23', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-2xl p-6 ${stat.bg} border border-white/5 relative overflow-hidden`}>
                    <div className="text-sm font-medium text-white/60 mb-2">{stat.label}</div>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <BarChart3 className="h-12 w-12" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-bold text-white/80 uppercase tracking-tighter">Son İşlemler</div>
                  <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-4 -mx-4 rounded-xl transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white/90">FAT-{2024000 + i}</div>
                          <div className="text-xs text-white/40">Global Logistics A.Ş.</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-400">+₺{(1200 + i * 300).toLocaleString()}</div>
                        <div className="text-[10px] font-black uppercase text-white/20">Tamamlandı</div>
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
