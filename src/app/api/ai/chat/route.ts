import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AI_API_KEY = process.env.AI_API_KEY || 'sk-N30PKdJ0Oc6wGU4p6gX5ibHfV5LHw1bw9t0voOkBauDqNVih';
const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

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
Kısa ve öz cevaplar ver. Emoji kullanabilirsin.`;

        if (context === 'bank') {
            systemPrompt += `\n\nŞu an kullanıcı Kasa ve Banka sayfasında. 
Banka hesapları, para transferleri ve banka ekstresi içe aktarma konularında yardımcı ol.`;
        } else if (context === 'invoice') {
            systemPrompt += `\n\nŞu an kullanıcı Faturalar sayfasında.
Fatura oluşturma, e-fatura, KDV hesaplama ve GİB entegrasyonu konularında yardımcı ol.`;
        } else if (context === 'contacts') {
            systemPrompt += `\n\nŞu an kullanıcı Cari Hesaplar sayfasında.
Müşteri ve tedarikçi yönetimi, bakiye takibi konularında yardımcı ol.`;
        } else if (context === 'reports') {
            systemPrompt += `\n\nŞu an kullanıcı Raporlar sayfasında.
Finansal raporlar, gelir-gider analizi ve KDV beyannamesi konularında yardımcı ol.`;
        }

        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`,
                'HTTP-Referer': 'https://accounting.innovmar.cloud',
                'X-Title': 'Innovmar Accounting',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3-haiku',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: message,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API error:', errorText);
            return NextResponse.json(
                { error: 'AI servisi şu an kullanılamıyor' },
                { status: 503 }
            );
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || 'Üzgünüm, şu an cevap veremiyorum.';

        return NextResponse.json({
            success: true,
            response: aiResponse,
            model: data.model,
        });
    } catch (error) {
        console.error('AI chat error:', error);
        return NextResponse.json(
            { error: 'AI asistan hatası' },
            { status: 500 }
        );
    }
}
