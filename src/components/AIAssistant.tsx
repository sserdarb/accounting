'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIAssistantProps {
    context?: 'general' | 'bank' | 'invoice' | 'contacts' | 'reports';
}

export default function AIAssistant({ context = 'general' }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add welcome message when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessages: Record<string, string> = {
                general: 'Merhaba! 👋 Ben Innovmar AI asistanıyım. Size nasıl yardımcı olabilirim?',
                bank: 'Merhaba! 🏦 Kasa ve banka işlemleri konusunda size yardımcı olabilirim. Hesap ekleme, para transferi veya banka ekstresi içe aktarma hakkında sorularınız varsa çekinmeden sorun!',
                invoice: 'Merhaba! 🧾 Fatura işlemleri konusunda yardımcı olabilirim. E-fatura, KDV hesaplama veya GİB entegrasyonu hakkında sorularınız varsa sorun!',
                contacts: 'Merhaba! 👥 Cari hesap yönetimi konusunda yardımcı olabilirim. Müşteri/tedarikçi ekleme veya bakiye takibi hakkında sorularınız var mı?',
                reports: 'Merhaba! 📊 Raporlar konusunda yardımcı olabilirim. Finansal analiz, gelir-gider raporu veya KDV beyannamesi hakkında sorularınız varsa sorun!',
            };
            setMessages([{ role: 'assistant', content: welcomeMessages[context] || welcomeMessages.general }]);
        }
    }, [isOpen, context, messages.length]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, context }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin. 😔' },
                ]);
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin. 🔌' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
                size="icon"
            >
                <Bot className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
            }`}>
            <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <CardTitle className="text-sm font-medium">AI Asistan</CardTitle>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="p-3 h-[380px] overflow-y-auto">
                        <div className="space-y-3">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg px-3 py-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </CardContent>

                    <div className="p-3 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Bir soru sorun..."
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
}
