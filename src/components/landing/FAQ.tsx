'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    {
      name: 'Genel',
      questions: [
        {
          q: 'E-Fatura sistemi nedir?',
          a: 'E-Fatura sistemi, Gelir İdaresi Başkanlığı (GİB) tarafından belirlenen standartlara uygun olarak elektronik ortamda oluşturulan, iletilen ve saklanan fatura sistemidir. Sistemimiz ile GİB e-Fatura portalına tam entegrasyon sağlayabilirsiniz.',
        },
        {
          q: 'Ücretsiz deneme süresi ne kadar?',
          a: 'Tüm paketlerimizde 14 gün ücretsiz deneme süresi bulunmaktadır. Bu süre içinde kredi kartı bilgisi gerekmez ve tüm özellikleri risk almadan deneyebilirsiniz.',
        },
        {
          q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          a: 'Kredi kartı, banka kartı, havale/EFT ve kurumsal ödeme seçeneklerimiz mevcuttur. iyzico ve PayTR güvenli ödeme altyapısını kullanıyoruz.',
        },
      ],
    },
    {
      name: 'Teknik',
      questions: [
        {
          q: 'Sistem gereksinimleri nelerdir?',
          a: 'Sistemimiz tamamen web tabanlıdır ve herhangi bir kurulum gerektirmez. İnternet bağlantısı olan herhangi bir cihazdan (bilgisayar, tablet, mobil) erişebilirsiniz.',
        },
        {
          q: 'Verilerim güvende mi?',
          a: 'Evet, verileriniz KVKK standartlarına uygun olarak şifrelenir ve güvende tutulur. HTTPS, JWT authentication, XSS ve CSRF koruması kullanıyoruz. Düzenli yedekleme yapıyoruz.',
        },
        {
          q: 'Mobil uygulamanız var mı?',
          a: 'Sistemimiz tam responsive tasarım ile mobil uyumludur. Ayrıca PWA (Progressive Web App) olarak mobil cihazınıza yükleyebilirsiniz. Kamera ile fatura çekme özelliği mevcuttur.',
        },
      ],
    },
    {
      name: 'Entegrasyon',
      questions: [
        {
          q: 'GİB e-Fatura ile nasıl entegre olabilirim?',
          a: 'GİB portalından aldığınız kullanıcı adı, şifre ve alias bilgilerini sistemimize girerek entegrasyonu sağlayabilirsiniz. Teknik ekibimiz bu süreçte size yardımcı olacaktır.',
        },
        {
          q: 'OCR fatura tanıma nasıl çalışır?',
          a: 'Fatura fotoğrafını veya PDF dosyasını sisteme yüklediğinizde, yapay zeka destekli OCR teknolojisi ile firma adı, vergi numarası, tarih, tutar ve KDV gibi bilgileri otomatik olarak tanır.',
        },
        {
          q: 'Gmail entegrasyonu nasıl çalışır?',
          a: 'Gmail hesabınızı güvenli bir şekilde sisteme bağlayın. Sistem gelen e-postaları otomatik tarar, fatura içeren e-postaları tespit eder ve fatura bilgilerini çıkarır.',
        },
      ],
    },
    {
      name: 'Ödeme',
      questions: [
        {
          q: 'Paketi değiştirebilir miyim?',
          a: 'Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklikler anında uygulanır ve ücret farkı orantılı olarak yansıtılır.',
        },
        {
          q: 'İstediğim zaman iptal edebilir miyim?',
          a: 'Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrası dönem sonuna kadar hizmet almaya devam edersiniz.',
        },
        {
          q: 'Fatura alabilir miyim?',
          a: 'Evet, her ay sonunda e-fatura olarak gönderdiğimiz kurumsal faturanızı alabilirsiniz.',
        },
      ],
    },
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
            Daha fazla bilgi için destek ekibimizle iletişime geçin.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="h-8 w-1 bg-primary rounded-full"></span>
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div
                      key={faqIndex}
                      className="bg-background border rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      >
                        <span className="font-medium pr-4">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-0">
                          <p className="text-muted-foreground">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Cevabını Bulamadınız mı?</h3>
            <p className="text-muted-foreground mb-6">
              Destek ekibimiz 7/24 hizmetinizde. Size yardımcı olmaktan mutluluk duyarız.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg">Canlı Destek</Button>
              <Button size="lg" variant="outline">
                Bize Yazın
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
