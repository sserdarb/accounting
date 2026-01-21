'use client';

import Link from 'next/link';
import { Mail, Facebook, Twitter, Linkedin, Instagram, Sparkles, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'Özellikler', href: '#features' },
      { name: 'Ücretlendirme', href: '#pricing' },
      { name: 'SSS', href: '#faq' },
      { name: 'Yenilikler', href: '#' },
    ],
    company: [
      { name: 'Hakkımızda', href: '#' },
      { name: 'Kariyer', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'İletişim', href: '#contact' },
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '#' },
      { name: 'Kullanım Şartları', href: '#' },
      { name: 'KVKK Aydınlatma Metni', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-3 mb-8 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/30 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">INNOVMAR</span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Accounting</span>
              </div>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-sm">
              Türkiye'nin yeni nesil dijital muhasebe platformu. GİB tam entegrasyonu ve yapay zeka destekli altyapısı ile işinizi geleceğe taşıyın.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium">hello@innovmar.cloud</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="font-medium">+90 (212) 555 01 23</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="font-medium">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1"></div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Ürün</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-slate-500 hover:text-emerald-400 font-bold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Şirket</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-slate-500 hover:text-blue-400 font-bold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Bültene Katıl</h3>
            <p className="text-slate-500 font-medium mb-6">En son güncellemeler ve teknolojik haberler e-postanıza gelsin.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors flex-grow"
              />
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white p-3 rounded-xl transition-colors">
                <Sparkles className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-slate-500 font-bold text-sm">
            © {new Date().getFullYear()} INNOVMAR. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="flex gap-6">
            {footerLinks.legal.map((link, index) => (
              <Link key={index} href={link.href} className="text-xs font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-tighter">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
