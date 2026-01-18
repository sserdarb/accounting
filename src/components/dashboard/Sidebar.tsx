'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Archive,
  Bell,
  HelpCircle,
  Wallet,
  Mail,
  Camera,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Faturalar', href: '/dashboard/invoices', icon: FileText },
  { name: 'Cari Hesaplar', href: '/dashboard/contacts', icon: Users },
  { name: 'Raporlar', href: '/dashboard/reports', icon: TrendingUp },
  { name: 'Banka & Kasa', href: '/dashboard/bank', icon: Wallet },
  { name: 'Fatura Sağlayıcıları', href: '/dashboard/bill-providers', icon: Zap },
  { name: 'E-posta', href: '/dashboard/email', icon: Mail },
  { name: 'OCR Okuma', href: '/dashboard/ocr', icon: Camera },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
];

const bottomNavigation = [
  { name: 'Yardım', href: '/dashboard/help', icon: HelpCircle },
  { name: 'Çıkış Yap', href: '/logout', icon: LogOut },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">E-Fatura</span>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t px-3 py-4">
            <div className="space-y-1">
              {bottomNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AB</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ahmet Yılmaz</p>
                <p className="text-xs text-muted-foreground truncate">ahmet@firma.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
