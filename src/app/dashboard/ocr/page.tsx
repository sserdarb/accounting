'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Save,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

export default function OCRPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOcrResult(null);
      setEditedData(null);
    }
  };

  const handleCameraCapture = () => {
    alert('Kamera özelliği mobil cihazlarda aktif olacak');
  };

  const processOCR = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR result
    const mockResult = {
      success: true,
      confidence: 0.92,
      data: {
        invoiceNumber: 'FAT-2024001',
        date: '2024-06-15',
        dueDate: '2024-07-15',
        customer: 'ABC Ltd. Şti.',
        taxNumber: '1234567890',
        taxOffice: 'İstanbul Vergi Dairesi',
        address: 'Maslak Mah. Büyükdere Cad. No:123 İstanbul',
        items: [
          { description: 'Web Yazılım Hizmeti', quantity: 1, unitPrice: 5000, vatRate: 20 },
          { description: 'Hosting Hizmeti', quantity: 12, unitPrice: 100, vatRate: 18 },
        ],
        subtotal: 6200,
        vatAmount: 1180,
        total: 7380,
      },
    };

    setOcrResult(mockResult);
    setEditedData(mockResult.data);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPreviewUrl('');
    setOcrResult(null);
    setEditedData(null);
  };

  const handleSave = () => {
    alert('Fatura başarıyla kaydedildi!');
    // Navigate to invoice list or create page
  };

  const handleEdit = (field: string, value: any) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleItemEdit = (index: number, field: string, value: any) => {
    const newItems = [...editedData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedData({ ...editedData, items: newItems });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">OCR Fatura Okuma</h1>
            <p className="text-muted-foreground">
              Fatura fotoğrafını yükleyin ve otomatik olarak okutun
            </p>
          </div>

          {!ocrResult ? (
            /* Upload Section */
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Fatura Yükle</CardTitle>
                  <CardDescription>
                    Fatura fotoğrafını veya PDF dosyasını yükleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Fatura önizlemesi"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" onClick={handleReset}>
                            <X className="mr-2 h-4 w-4" />
                            Kaldır
                          </Button>
                          <Button onClick={processOCR} disabled={isProcessing}>
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                İşleniyor...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Okut
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                          <p className="font-medium">Fatura yüklemek için tıklayın</p>
                          <p className="text-sm text-muted-foreground">
                            veya sürükleyip bırakın
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Dosya Seç
                          </Button>
                        </label>
                        <Button variant="outline" onClick={handleCameraCapture}>
                          <Camera className="mr-2 h-4 w-4" />
                          Kamera ile Çek
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                          JPG, PNG, GIF veya PDF. Maksimum 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="font-medium">İpuçları:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Net ve iyi aydınlatılmış fotoğraflar kullanın</li>
                      <li>• Faturanın tüm alanlarının görünür olduğundan emin olun</li>
                      <li>• Yansıma ve gölgelerden kaçının</li>
                      <li>• Yüksek çözünürlüklü fotoğraflar tercih edin</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Result Section */
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Fatura Başarıyla Okundu</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Güvenlik: %{(ocrResult.confidence * 100).toFixed(0)}</Badge>
                        <p className="text-sm text-muted-foreground">
                          Lütfen bilgileri kontrol edin ve gerekirse düzeltin
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yeni Fatura
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fatura Önizlemesi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={previewUrl}
                      alt="Fatura önizlemesi"
                      className="w-full rounded-lg"
                    />
                  </CardContent>
                </Card>

                {/* Edit Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fatura Bilgileri</CardTitle>
                    <CardDescription>
                      Okunan bilgileri düzenleyin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fatura No</label>
                      <Input
                        value={editedData.invoiceNumber}
                        onChange={(e) => handleEdit('invoiceNumber', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tarih</label>
                        <Input
                          type="date"
                          value={editedData.date}
                          onChange={(e) => handleEdit('date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vade Tarihi</label>
                        <Input
                          type="date"
                          value={editedData.dueDate}
                          onChange={(e) => handleEdit('dueDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Müşteri</label>
                      <Input
                        value={editedData.customer}
                        onChange={(e) => handleEdit('customer', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vergi No</label>
                        <Input
                          value={editedData.taxNumber}
                          onChange={(e) => handleEdit('taxNumber', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vergi Dairesi</label>
                        <Input
                          value={editedData.taxOffice}
                          onChange={(e) => handleEdit('taxOffice', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Adres</label>
                      <Input
                        value={editedData.address}
                        onChange={(e) => handleEdit('address', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Fatura Kalemleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editedData.items.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium">Açıklama</label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemEdit(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Miktar</label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemEdit(index, 'quantity', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Birim Fiyat</label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemEdit(index, 'unitPrice', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">KDV %</label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            value={item.vatRate}
                            onChange={(e) => handleItemEdit(index, 'vatRate', parseInt(e.target.value))}
                          >
                            <option value="0">%0</option>
                            <option value="1">%1</option>
                            <option value="8">%8</option>
                            <option value="10">%10</option>
                            <option value="18">%18</option>
                            <option value="20">%20</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ara Toplam</span>
                      <span className="font-medium">₺{editedData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">KDV</span>
                      <span className="font-medium">₺{editedData.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Toplam</span>
                        <span>₺{editedData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <X className="mr-2 h-4 w-4" />
                  İptal
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  İndir
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Faturayı Kaydet
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
