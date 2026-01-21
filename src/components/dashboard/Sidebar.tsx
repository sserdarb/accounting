'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  HelpCircle,
  Wallet,
  Mail,
  Camera,
  Zap,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface UserInfo {
  name: string;
  email: string;
  companyName: string;
  role: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.user.name,
            email: data.user.email,
            companyName: data.user.companyName,
            role: data.user.role
          });
          setIsImpersonating(data.user.isImpersonating || false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
              <span className="font-bold">Innovmar</span>
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

              {/* Admin Panel Link - Only for masteradmin */}
              {user?.role === 'masteradmin' && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mt-4 border-t pt-4',
                    pathname === '/admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  Admin Paneli
                </Link>
              )}
            </div>
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t px-3 py-4">
            <div className="space-y-1">
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle className="h-4 w-4" />
                Yardım
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="border-t p-4">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">?</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Bilinmeyen Kullanıcı</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
