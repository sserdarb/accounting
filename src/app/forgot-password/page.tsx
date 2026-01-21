'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Implement actual password reset API call
            // const res = await fetch('/api/auth/forgot-password', { ... });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: 'E-posta Gönderildi',
                description: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.',
            });
            setEmail('');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Şifrenizi mi unuttunuz?
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
                    </p>
                </div>

                <div className="mt-8 bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    placeholder="ornek@sirket.com"
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    'Sıfırlama Bağlantısı Gönder'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">
                                    veya
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link
                                href="/login"
                                className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
