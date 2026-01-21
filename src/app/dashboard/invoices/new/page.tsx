'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Loader2,
    Save,
} from 'lucide-react';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    vatRate: number;
}

export default function NewInvoicePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'sales',
        customerName: '',
        customerTaxNumber: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: '',
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: '', quantity: 1, unit: 'Adet', unitPrice: 0, vatRate: 20 }
    ]);

    const addItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), description: '', quantity: 1, unit: 'Adet', unitPrice: 0, vatRate: 20 }
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const calculateVat = () => {
        return items.reduce((sum, item) =>
            sum + (item.quantity * item.unitPrice * item.vatRate / 100), 0
        );
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateVat();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: items.map(item => ({
                        ...item,
                        total: item.quantity * item.unitPrice * (1 + item.vatRate / 100)
                    }))
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Fatura oluşturulamadı');
            }

            toast({
                title: 'Başarılı',
                description: 'Fatura başarıyla oluşturuldu',
            });

            router.push('/dashboard/invoices');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Hata',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 lg:ml-64">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Yeni Fatura</h1>
                            <p className="text-muted-foreground">Yeni bir fatura oluşturun</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Invoice Type */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fatura Türü</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sales">Satış Faturası</SelectItem>
                                                <SelectItem value="purchase">Alış Faturası</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardContent>
                                </Card>

                                {/* Customer Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Müşteri Bilgileri</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="customerName">Müşteri Adı</Label>
                                                <Input
                                                    id="customerName"
                                                    value={formData.customerName}
                                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                    placeholder="Müşteri veya firma adı"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="customerTaxNumber">Vergi Numarası</Label>
                                                <Input
                                                    id="customerTaxNumber"
                                                    value={formData.customerTaxNumber}
                                                    onChange={(e) => setFormData({ ...formData, customerTaxNumber: e.target.value })}
                                                    placeholder="10 haneli vergi numarası"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dates */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tarihler</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date">Fatura Tarihi</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dueDate">Vade Tarihi</Label>
                                                <Input
                                                    id="dueDate"
                                                    type="date"
                                                    value={formData.dueDate}
                                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Items */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Ürün/Hizmetler</CardTitle>
                                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Satır Ekle
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {items.map((item, index) => (
                                                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                                                    <div className="col-span-12 md:col-span-4">
                                                        <Label className="text-xs">Açıklama</Label>
                                                        <Input
                                                            value={item.description}
                                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                            placeholder="Ürün/hizmet açıklaması"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-1">
                                                        <Label className="text-xs">Miktar</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-1">
                                                        <Label className="text-xs">Birim</Label>
                                                        <Input
                                                            value={item.unit}
                                                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-4 md:col-span-2">
                                                        <Label className="text-xs">Birim Fiyat (₺)</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.unitPrice}
                                                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-2">
                                                        <Label className="text-xs">KDV (%)</Label>
                                                        <Select
                                                            value={item.vatRate.toString()}
                                                            onValueChange={(value) => updateItem(item.id, 'vatRate', parseInt(value))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="0">%0</SelectItem>
                                                                <SelectItem value="1">%1</SelectItem>
                                                                <SelectItem value="10">%10</SelectItem>
                                                                <SelectItem value="20">%20</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                                                        <span className="text-sm font-medium">
                                                            ₺{(item.quantity * item.unitPrice * (1 + item.vatRate / 100)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                        </span>
                                                        {items.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notlar</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Fatura ile ilgili eklemek istediğiniz notlar..."
                                            rows={4}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary */}
                            <div className="space-y-6">
                                <Card className="sticky top-4">
                                    <CardHeader>
                                        <CardTitle>Özet</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Ara Toplam</span>
                                            <span>₺{calculateSubtotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">KDV</span>
                                            <span>₺{calculateVat().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                            <span>Toplam</span>
                                            <span>₺{calculateTotal().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        </div>

                                        <div className="pt-4 space-y-2">
                                            <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Kaydediliyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Fatura Oluştur
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => router.back()}
                                            >
                                                İptal
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
