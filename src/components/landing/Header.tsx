'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled
      ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 py-2 shadow-xl'
      : 'bg-slate-900/80 backdrop-blur-md py-4'
      }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">INNOVMAR</span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Accounting</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            {[
              { name: 'Özellikler', href: '#features' },
              { name: 'Fiyatlandırma', href: '#pricing' },
              { name: 'SSS', href: '#faq' },
              { name: 'İletişim', href: '#contact' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-bold text-white/90 hover:text-emerald-400 transition-colors uppercase tracking-widest"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 font-bold border border-white/20">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-6 shadow-lg shadow-emerald-600/30">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-white hover:bg-white/10 transition-all"
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
              {[
                { name: 'Özellikler', href: '#features' },
                { name: 'Fiyatlandırma', href: '#pricing' },
                { name: 'SSS', href: '#faq' },
                { name: 'İletişim', href: '#contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-lg font-bold text-white hover:text-emerald-400 hover:bg-white/5 rounded-2xl transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full py-6 text-white text-lg font-bold border border-white/20">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-black">
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
