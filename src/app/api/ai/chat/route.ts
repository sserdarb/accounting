import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDb9g1p9ioHbDDt_LNku_NQMzeg6z4zxB0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System features for context
const SYSTEM_FEATURES = `
Innovmar Accounting Sistemi Özellikleri:

1. FATURA YÖNETİMİ
   - Satış ve alış faturası oluşturma
   - E-fatura ve e-arşiv fatura desteği
   - GİB entegrasyonu ile otomatik gönderim
   - KDV hesaplama (%1, %8, %10, %18, %20)
   - Fatura şablonları ve PDF çıktı

2. CARİ HESAPLAR
   - Müşteri ve tedarikçi yönetimi
   - Bakiye takibi (alacak/borç)
   - İletişim bilgileri ve vergi numarası
   - Cari ekstre görüntüleme

3. BANKA & KASA
   - Banka hesabı, kasa ve kredi kartı tanımlama
   - Para transferi (hesaplar arası)
   - Banka ekstresi içe aktarma (AI ile otomatik sınıflandırma)
   - Gelir/gider takibi
   - TRY, USD, EUR para birimleri

4. RAPORLAR
   - Gelir-gider raporu
   - KDV raporu
   - Müşteri analizi
   - Nakit akışı raporu
   - PDF ve Excel export

5. AYARLAR
   - Şirket bilgileri
   - Vergi numarası ve dairesi
   - Logo ve iletişim bilgileri
   - GİB entegrasyon ayarları

6. MASTER ADMIN (Yönetici)
   - Tüm kullanıcıları görüntüleme
   - Kullanıcı ekleme/düzenleme/silme
   - Firma oluşturma
   - Kullanıcı olarak giriş yapma (impersonate)
`;

// POST /api/ai/chat - AI Assistant for the application
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, context = 'general' } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Mesaj gerekli' },
                { status: 400 }
            );
        }

        // Build system prompt based on context
        let systemPrompt = `Sen Innovmar Accounting uygulamasının yapay zeka asistanısın. 
Kullanıcılara Türkçe olarak yardımcı oluyorsun. 
Muhasebe, fatura, banka işlemleri ve finansal konularda uzmanısın.
Kısa ve öz cevaplar ver. Emoji kullanabilirsin.

${SYSTEM_FEATURES}`;

        if (context === 'bank') {
            systemPrompt += `\n\nŞu an kullanıcı Kasa ve Banka sayfasında. 
Banka hesapları, para transferleri ve banka ekstresi içe aktarma konularında yardımcı ol.
Kullanıcıya "Yeni Hesap Ekle", "Para Transferi" ve "Ekstre İçe Aktar" butonlarını kullanabileceğini hatırlat.`;
        } else if (context === 'invoice') {
            systemPrompt += `\n\nŞu an kullanıcı Faturalar sayfasında.
Fatura oluşturma, e-fatura, KDV hesaplama ve GİB entegrasyonu konularında yardımcı ol.
"Yeni Fatura" butonuyla fatura oluşturabileceğini belirt.`;
        } else if (context === 'contacts') {
            systemPrompt += `\n\nŞu an kullanıcı Cari Hesaplar sayfasında.
Müşteri ve tedarikçi yönetimi, bakiye takibi konularında yardımcı ol.
"Yeni Cari Ekle" butonuyla müşteri veya tedarikçi ekleyebileceğini belirt.`;
        } else if (context === 'reports') {
            systemPrompt += `\n\nŞu an kullanıcı Raporlar sayfasında.
Finansal raporlar, gelir-gider analizi ve KDV beyannamesi konularında yardımcı ol.
PDF ve Excel export butonlarını kullanabileceğini hatırlat.`;
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: systemPrompt },
                            { text: `\n\nKullanıcı sorusu: ${message}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return NextResponse.json(
                { error: 'AI servisi şu an kullanılamıyor' },
                { status: 503 }
            );
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Üzgünüm, şu an cevap veremiyorum.';

        return NextResponse.json({
            success: true,
            response: aiResponse,
            model: 'gemini-2.0-flash',
        });
    } catch (error) {
        console.error('AI chat error:', error);
        return NextResponse.json(
            { error: 'AI asistan hatası' },
            { status: 500 }
        );
    }
}
