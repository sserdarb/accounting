'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, FileText, BarChart3, Shield, Zap, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-2'
        : 'bg-transparent py-4'
      }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter leading-none">ANTIGRAVITY</span>
                <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">Accounting</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            {['Özellikler', 'Ücretlendirme', 'SSS', 'İletişim'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 font-bold">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 shadow-lg shadow-blue-600/20">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menüyü aç</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-4">
              {['Özellikler', 'Ücretlendirme', 'SSS', 'İletişim'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-3 text-lg font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full py-6 text-white text-lg font-bold">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white text-lg font-black">
                  Ücretsiz Başla
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
