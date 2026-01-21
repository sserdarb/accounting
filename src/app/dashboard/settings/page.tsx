'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Key, Mail, ScanFace, Save } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Ayarlar yüklenirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Ayarlar kaydedildi.',
        });
        fetchSettings(); // Refresh to update "hasKey" statuses
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Ayarlar kaydedilemedi.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
          <p className="text-muted-foreground">Sistem entegrasyonlarını ve şirket bilgilerini yönetin.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? 'Kaydediliyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" /> Şirket</TabsTrigger>
          <TabsTrigger value="gib" className="gap-2"><Key className="w-4 h-4" /> GİB</TabsTrigger>
          <TabsTrigger value="ocr" className="gap-2"><ScanFace className="w-4 h-4" /> OCR</TabsTrigger>
          <TabsTrigger value="gmail" className="gap-2"><Mail className="w-4 h-4" /> Gmail</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Şirket Bilgileri</CardTitle>
              <CardDescription>Resmi evraklarda ve faturalarda görünecek bilgiler.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Şirket Adı</Label>
                  <Input value={settings.name || ''} onChange={e => setSettings({ ...settings, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vergi Numarası (VKN/TCKN)</Label>
                  <Input value={settings.taxNumber || ''} onChange={e => setSettings({ ...settings, taxNumber: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vergi Dairesi</Label>
                <Input value={settings.taxOffice || ''} onChange={e => setSettings({ ...settings, taxOffice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Adres</Label>
                <Input value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gib">
          <Card>
            <CardHeader>
              <CardTitle>GİB E-Fatura Bağlantısı</CardTitle>
              <CardDescription>E-Fatura gönderimi için portal giriş bilgileri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>GİB Kullanıcı Adı</Label>
                <Input value={settings.gibUsername || ''} onChange={e => setSettings({ ...settings, gibUsername: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>GİB Şifre</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={settings.hasGibPassword ? "••••••••" : "Yeni şifre girin"}
                    onChange={e => setSettings({ ...settings, gibPassword: e.target.value })}
                  />
                  {settings.hasGibPassword && <span className="text-xs text-green-500 flex items-center">Kayıtlı</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Birim Etiketi (Alias)</Label>
                <Input value={settings.gibAlias || ''} onChange={e => setSettings({ ...settings, gibAlias: e.target.value })} placeholder="urn:mail:defaultpk@duas.com.tr" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr">
          <Card>
            <CardHeader>
              <CardTitle>OCR Ayarları</CardTitle>
              <CardDescription>Fatura tarama ve veri çıkarma servisi yapılandırması.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Servis Sağlayıcı</Label>
                <Select value={settings.ocrProvider || 'tesseract'} onValueChange={v => setSettings({ ...settings, ocrProvider: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-vision">Google Cloud Vision API</SelectItem>
                    <SelectItem value="tesseract">Tesseract.js (Yerel-Simüle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>API Anahtarı</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={settings.hasOcrApiKey ? "••••••••" : "API Key girin"}
                    onChange={e => setSettings({ ...settings, ocrApiKey: e.target.value })}
                  />
                  {settings.hasOcrApiKey && <span className="text-xs text-green-500 flex items-center">Kayıtlı</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gmail">
          <Card>
            <CardHeader>
              <CardTitle>Gmail Entegrasyonu</CardTitle>
              <CardDescription>E-postalardan otomatik fatura aktarımı için OAuth2 bilgileri.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input value={settings.gmailClientId || ''} onChange={e => setSettings({ ...settings, gmailClientId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <Input
                  type="password"
                  placeholder={settings.hasGmailClientSecret ? "••••••••" : "Secret girin"}
                  onChange={e => setSettings({ ...settings, gmailClientSecret: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Refresh Token</Label>
                <Input
                  type="password"
                  placeholder={settings.hasGmailRefreshToken ? "••••••••" : "Refresh token girin"}
                  onChange={e => setSettings({ ...settings, gmailRefreshToken: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
