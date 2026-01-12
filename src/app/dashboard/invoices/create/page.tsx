'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToPDF, exportToExcel } from '@/lib/export';
import {
  Save,
  Send,
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  Calculator,
  Printer,
  FileDown,
} from 'lucide-react';

export default function CreateInvoicePage() {
  const [formData, setFormData] = useState({
    type: 'sales',
    customer: '',
    taxNumber: '',
    taxOffice: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
  });

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, unit: 'Adet', unitPrice: 0, vatRate: 20 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        description: '',
        quantity: 1,
        unit: 'Adet',
        unitPrice: 0,
        vatRate: 20,
      },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const vatAmount = items.reduce(
      (sum, item) =>
        sum + (item.quantity * item.unitPrice * item.vatRate) / 100,
      0
    );
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Yeni Fatura</h1>
                <p className="text-muted-foreground">
                  Satış faturası oluşturun
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const reportData = {
                    title: 'Fatura Detayı',
                    subtitle: `Müşteri: ${formData.customer || 'Belirtilmedi'}`,
                    headers: ['Açıklama', 'Miktar', 'Birim Fiyat', 'KDV %', 'Tutar'],
                    data: items.map(item => [
                      item.description || 'Belirtilmedi',
                      item.quantity,
                      `₺${item.unitPrice.toFixed(2)}`,
                      `%${item.vatRate}`,
                      `₺${(item.quantity * item.unitPrice * (1 + item.vatRate / 100)).toFixed(2)}`
                    ])
                  };
                  exportToPDF({ ...reportData, fileName: `fatura_${formData.customer || 'draft'}` });
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                PDF Yazdır
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const reportData = {
                    title: 'Fatura Detayı',
                    headers: ['Açıklama', 'Miktar', 'Birim Fiyat', 'KDV %', 'Tutar'],
                    data: items.map(item => [
                      item.description || 'Belirtilmedi',
                      item.quantity,
                      `₺${item.unitPrice.toFixed(2)}`,
                      `%${item.vatRate}`,
                      `₺${(item.quantity * item.unitPrice * (1 + item.vatRate / 100)).toFixed(2)}`
                    ])
                  };
                  exportToExcel({ ...reportData, fileName: `fatura_${formData.customer || 'draft'}` });
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Excel İndir
              </Button>
              <Button variant="outline" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Taslak Kaydet
              </Button>
              <Button size="lg">
                <Send className="mr-2 h-4 w-4" />
                Gönder
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoice Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Müşteri Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Müşteri Adı *</label>
                      <Input
                        placeholder="Şirket Adı Ltd. Şti."
                        value={formData.customer}
                        onChange={(e) =>
                          setFormData({ ...formData, customer: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vergi Numarası *</label>
                      <Input
                        placeholder="1234567890"
                        value={formData.taxNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, taxNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vergi Dairesi</label>
                      <Input
                        placeholder="İstanbul Vergi Dairesi"
                        value={formData.taxOffice}
                        onChange={(e) =>
                          setFormData({ ...formData, taxOffice: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fatura Tarihi *</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vade Tarihi</label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adres</label>
                    <Input
                      placeholder="Adres bilgileri"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Fatura Kalemleri
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Kalem Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-12 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div className="col-span-5">Açıklama</div>
                      <div className="col-span-2">Miktar</div>
                      <div className="col-span-2">Birim Fiyat</div>
                      <div className="col-span-2">KDV %</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Items */}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start pb-4 border-b last:border-0"
                      >
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-xs text-muted-foreground md:hidden">
                            Açıklama
                          </label>
                          <Input
                            placeholder="Ürün/Hizmet açıklaması"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, 'description', e.target.value)
                            }
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs text-muted-foreground md:hidden">
                            Miktar
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, 'quantity', parseFloat(e.target.value))
                            }
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs text-muted-foreground md:hidden">
                            Birim Fiyat
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="₺0.00"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, 'unitPrice', parseFloat(e.target.value))
                            }
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs text-muted-foreground md:hidden">
                            KDV %
                          </label>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                            value={item.vatRate}
                            onChange={(e) =>
                              updateItem(item.id, 'vatRate', parseInt(e.target.value))
                            }
                          >
                            <option value="0">%0</option>
                            <option value="1">%1</option>
                            <option value="8">%8</option>
                            <option value="10">%10</option>
                            <option value="18">%18</option>
                            <option value="20">%20</option>
                          </select>
                        </div>
                        <div className="md:col-span-1 flex items-start justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Fatura notları..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Özet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="font-medium">₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KDV</span>
                    <span className="font-medium">₺{vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Şablondan Yükle
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    OCR ile Okut
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Kopyala
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
