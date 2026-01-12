'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mail, Lock, User, Building, ArrowRight, Chrome, Check } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    taxNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    kvkk: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor');
      return;
    }
    if (!agreements.terms || !agreements.kvkk) {
      alert('Lütfen tüm sözleşmeleri kabul edin');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Kayıt sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Google OAuth registration will be implemented
    console.log('Google register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">E-Fatura</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Hesap Oluştur</CardTitle>
            <CardDescription>
              Ücretsiz deneme ile hemen başlayın, kredi kartı gerekmez
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Kişisel Bilgiler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Adınız Soyadınız"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-posta *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Firma Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">
                      Firma Adı *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        placeholder="Şirket Adı Ltd. Şti."
                        className="pl-10"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="taxNumber" className="text-sm font-medium">
                      Vergi Numarası *
                    </label>
                    <Input
                      id="taxNumber"
                      placeholder="1234567890"
                      value={formData.taxNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, taxNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Güvenlik
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Şifre *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="En az 8 karakter"
                        className="pl-10"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Şifre Tekrar *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Şifrenizi tekrar girin"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-input mt-1"
                    checked={agreements.terms}
                    onChange={(e) =>
                      setAgreements({ ...agreements, terms: e.target.checked })
                    }
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    <Link href="#" className="text-primary hover:underline">
                      Kullanım Sözleşmesi
                    </Link>{' '}
                    'ni okudum ve kabul ediyorum *
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="kvkk"
                    className="h-4 w-4 rounded border-input mt-1"
                    checked={agreements.kvkk}
                    onChange={(e) =>
                      setAgreements({ ...agreements, kvkk: e.target.checked })
                    }
                    required
                  />
                  <label htmlFor="kvkk" className="text-sm text-muted-foreground">
                    <Link href="#" className="text-primary hover:underline">
                      KVKK Aydınlatma Metni
                    </Link>{' '}
                    'ni okudum ve onaylıyorum *
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Kayıt Yapılıyor...' : 'Ücretsiz Deneyin'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Veya şununla devam et
                </span>
              </div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google ile Kayıt Ol
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Giriş Yapın
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Check className="h-5 w-5 text-green-600" />,
              text: '14 gün ücretsiz deneme',
            },
            {
              icon: <Check className="h-5 w-5 text-green-600" />,
              text: 'Kredi kartı gerekmez',
            },
            {
              icon: <Check className="h-5 w-5 text-green-600" />,
              text: 'İstediğiniz zaman iptal',
            },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              {benefit.icon}
              {benefit.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
