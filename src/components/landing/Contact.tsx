'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'E-posta',
      value: 'destek@efatura.com',
      href: 'mailto:destek@efatura.com',
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Telefon',
      value: '+90 212 123 45 67',
      href: 'tel:+902121234567',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Adres',
      value: 'Maslak Mah. Büyükdere Cad. No:123\n34398 Şişli/İstanbul',
      href: null,
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-lg text-muted-foreground">
            Sorularınız mı var? Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
            Aşağıdaki formu doldurun veya doğrudan bize ulaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>
                  Size yardımcı olmak için buradayız
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {info.label}
                      </div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-sm whitespace-pre-line">
                          {info.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Bizi Takip Edin</CardTitle>
                <CardDescription>
                  Sosyal medyadan güncel haberleri takip edin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Canlı Destek</div>
                    <div className="text-sm text-muted-foreground">
                      Hemen yanıt al
                    </div>
                  </div>
                </div>
                <Button className="w-full" variant="default">
                  Canlı Destek Başlat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mesaj Gönderin</CardTitle>
                <CardDescription>
                  Formu doldurun, en kısa sürede size döneceğiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Ad Soyad *
                      </label>
                      <Input
                        id="name"
                        placeholder="Adınız Soyadınız"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        E-posta *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Konu *
                    </label>
                    <Input
                      id="subject"
                      placeholder="Mesajınızın konusu"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mesaj *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="h-4 w-4 rounded border-input"
                      required
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground">
                      KVKK metnini okudum ve kabul ediyorum *
                    </label>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Mesaj Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Harita yükleniyor...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Maslak Mah. Büyükdere Cad. No:123, 34398 Şişli/İstanbul
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
