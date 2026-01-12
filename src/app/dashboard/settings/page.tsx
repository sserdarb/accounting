'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Key,
  Shield,
  Bell,
  Globe,
  Database,
  Save,
  Camera,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'integrations' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'company', label: 'Şirket', icon: Building2 },
    { id: 'integrations', label: 'Entegrasyonlar', icon: Globe },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Ayarlar başarıyla kaydedildi!');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
            <p className="text-muted-foreground">
              Sistem ayarlarını yönetin
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-shrink-0"
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription>
                    Kişisel bilgilerinizi güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full p-2"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">Profil Fotoğrafı</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG veya GIF. Maksimum 2MB
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ad</label>
                      <Input placeholder="Adınız" defaultValue="Ahmet" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Soyad</label>
                      <Input placeholder="Soyadınız" defaultValue="Yılmaz" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">E-posta</label>
                      <Input type="email" placeholder="E-posta adresiniz" defaultValue="ahmet@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefon</label>
                      <Input type="tel" placeholder="+90 555 123 45 67" defaultValue="+90 555 123 45 67" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Şirket Bilgileri</CardTitle>
                  <CardDescription>
                    Şirket bilgilerinizi güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Şirket Adı *</label>
                      <Input placeholder="Şirket Adı Ltd. Şti." defaultValue="Demo Şirket A.Ş." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vergi Numarası *</label>
                      <Input placeholder="1234567890" defaultValue="1234567890" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vergi Dairesi *</label>
                      <Input placeholder="İstanbul Vergi Dairesi" defaultValue="İstanbul Vergi Dairesi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ticaret Sicil No</label>
                      <Input placeholder="123456" defaultValue="123456" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Adres</label>
                      <Input placeholder="Adres bilgileri" defaultValue="Maslak Mah. Büyükdere Cad. No:123 İstanbul" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">E-posta</label>
                      <Input type="email" placeholder="info@company.com" defaultValue="info@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefon</label>
                      <Input type="tel" placeholder="+90 212 123 45 67" defaultValue="+90 212 123 45 67" />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Şirket Logosu</label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Logo yüklemek için tıklayın veya sürükleyin
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG veya SVG. Maksimum 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* GIB Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    GİB E-Fatura Entegrasyonu
                  </CardTitle>
                  <CardDescription>
                    Gelir İdaresi Başkanlığı e-Fatura sistemi ile entegrasyon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">Entegrasyon Aktif</p>
                        <p className="text-sm text-muted-foreground">
                          Son senkronizasyon: 2024-06-15 14:30
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Bağlı</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GİB Kullanıcı Adı</label>
                      <Input placeholder="GİB kullanıcı adınız" defaultValue="demo_user" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GİB Şifre</label>
                      <Input type="password" placeholder="••••••••" defaultValue="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Portal URL</label>
                      <Input placeholder="https://portal.efatura.gov.tr" defaultValue="https://portal.efatura.gov.tr" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">VKN/TCKN</label>
                      <Input placeholder="1234567890" defaultValue="1234567890" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Şifre Değiştir
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      Bağlantıyı Kaldır
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gmail Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Gmail Entegrasyonu
                  </CardTitle>
                  <CardDescription>
                    Gmail ile otomatik fatura işleme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-medium">Entegrasyon Pasif</p>
                        <p className="text-sm text-muted-foreground">
                          Gmail hesabınızı bağlayın
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Bağlı Değil</Badge>
                  </div>

                  <Button>
                    <Globe className="mr-2 h-4 w-4" />
                    Google ile Bağla
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Bu entegrasyon şunları sağlar:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Gelen e-postaları otomatik tara</li>
                      <li>E-posta eklerinden fatura çıkar</li>
                      <li>Faturaları otomatik sisteme ekle</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Bildirim Ayarları
                  </CardTitle>
                  <CardDescription>
                    Hangi bildirimleri almak istediğinizi seçin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">E-posta Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">
                          Önemli güncellemeler için e-posta alın
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Fatura Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">
                          Yeni fatura geldiğinde bildir
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Ödeme Hatırlatıcıları</p>
                        <p className="text-sm text-muted-foreground">
                          Vade yaklaşan faturalar için hatırlatma
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rapor Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">
                          Haftalık/AYLIK raporlar alın
                        </p>
                      </div>
                      <input type="checkbox" className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sistem Bildirimleri</p>
                        <p className="text-sm text-muted-foreground">
                          Bakım ve güncelleme bildirimleri
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Güvenlik Ayarları
                  </CardTitle>
                  <CardDescription>
                    Hesap güvenliğinizi yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mevcut Şifre</label>
                      <Input type="password" placeholder="Mevcut şifreniz" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Yeni Şifre</label>
                        <Input type="password" placeholder="Yeni şifreniz" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Şifre Tekrar</label>
                        <Input type="password" placeholder="Şifre tekrar" />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      Şifre Değiştir
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">İki Faktörlü Kimlik Doğrulama</p>
                        <p className="text-sm text-muted-foreground">
                          Hesabınızı ekstra güvenlik ile koruyun
                        </p>
                      </div>
                      <input type="checkbox" className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Oturumları Kapat</p>
                        <p className="text-sm text-muted-foreground">
                          Tüm cihazlardaki oturumları kapatın
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Oturumları Kapat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              İptal
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
