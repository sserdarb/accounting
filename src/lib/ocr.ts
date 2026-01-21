/**
 * OCR (Optical Character Recognition) Servisi
 * 
 * Bu modül, fatura görsellerinden metin çıkarma yapar.
 * Google Vision API veya Tesseract kullanılabilir.
 */

export interface OCRConfig {
  provider: 'google-vision' | 'tesseract';
  apiKey?: string;
}

export interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  error?: string;
}

export interface ParsedInvoiceData {
  customerName?: string;
  taxNumber?: string;
  date?: string;
  invoiceNumber?: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
  }[];
  subtotal?: number;
  vatAmount?: number;
  total?: number;
}

class OCRService {
  private config: OCRConfig | null = null;

  async initializeWithCompany(companyId: string): Promise<boolean> {
    try {
      const Company = (await import('@/models/Company')).default;
      const connectDB = (await import('@/lib/mongodb')).default;

      await connectDB();
      const company = await Company.findById(companyId);

      if (!company || !company.ocrProvider) {
        console.warn('OCR yapılandırması eksik');
        return false;
      }

      this.config = {
        provider: company.ocrProvider as 'google-vision' | 'tesseract',
        apiKey: company.ocrApiKey
      };

      return true;
    } catch (error) {
      console.error('OCR Servis İlklendirme Hatası:', error);
      return false;
    }
  }

  configure(config: OCRConfig): void {
    this.config = config;
  }

  /**
   * Resimden metin çıkarır (Simülasyon)
   */
  async extractTextFromImage(imageBase64: string): Promise<OCRResult> {
    console.log('OCR metin çıkarma simülasyonu başlatıldı...');

    // Simülasyon gecikmesi
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockTexts = [
      'FATURA NO: ABC20240000001\nTARİH: 15.01.2024\nVKN: 1234567890\nALICI: TEST TEKNOLOJİ A.Ş.\nTOPLAM: 1.440,00 TL',
      'INVOICE #INV-9982\nDATE: 2024-02-10\nTAX ID: 0987654321\nCUSTOMER: GLOBAL LOJİSTİK LTD.\nTOTAL AMOUNT: 5.250,50 ₺',
    ];

    return {
      success: true,
      text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
      confidence: 0.92 + Math.random() * 0.05
    };
  }

  /**
   * PDF'den metin çıkarır (Simülasyon)
   */
  async extractTextFromPDF(pdfBase64: string): Promise<OCRResult> {
    console.log('PDF OCR simülasyonu başlatıldı...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      text: 'PDF DETECTED: FATURA NO: PDF-2024-XP\nTARİH: 20.01.2024\nTOPLAM: 2.100,00 ₺',
      confidence: 0.98
    };
  }

  /**
   * Metinden fatura bilgilerini ayrıştırır (Geliştirilmiş Simülasyon)
   */
  async parseInvoiceFromText(text: string): Promise<ParsedInvoiceData | null> {
    console.log('Metin ayrıştırılıyor:', text.substring(0, 50) + '...');

    const result: ParsedInvoiceData = {};

    // Gelişmiş RegEx tespiti simülasyonu
    const taxMatch = text.match(/(?:VKN|TAX ID|Vergi No)[:\s]*(\d{10})/i);
    if (taxMatch) result.taxNumber = taxMatch[1];

    const dateMatch = text.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);
    if (dateMatch) result.date = dateMatch[1];

    const totalMatch = text.match(/(?:TOPLAM|TOTAL|TUTAR)[:\s]*₺?[\s]*(\d+[.,]\d{2})/i);
    if (totalMatch) result.total = parseFloat(totalMatch[1].replace('.', '').replace(',', '.'));

    const invoiceMatch = text.match(/(?:FATURA NO|INVOICE #)[:\s]*([A-Z0-9-]+)/i);
    if (invoiceMatch) result.invoiceNumber = invoiceMatch[1];

    // Örnek kalem ekleme
    result.items = [
      { description: 'Genel Hizmet Bedeli', quantity: 1, unitPrice: result.total ? result.total / 1.2 : 0, vatRate: 20 }
    ];

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Dosyadan fatura bilgilerini çıkarır (tam akış)
   */
  async extractInvoiceFromFile(fileData: { buffer: Buffer; mimeType: string }): Promise<{
    success: boolean;
    data?: ParsedInvoiceData;
    error?: string;
  }> {
    try {
      let ocrResult: OCRResult;

      if (fileData.mimeType === 'application/pdf') {
        ocrResult = await this.extractTextFromPDF(fileData.buffer.toString('base64'));
      } else {
        ocrResult = await this.extractTextFromImage(fileData.buffer.toString('base64'));
      }

      if (!ocrResult.success) return { success: false, error: ocrResult.error };

      const parsedData = await this.parseInvoiceFromText(ocrResult.text || '');

      return {
        success: true,
        data: parsedData || undefined,
      };
    } catch (error) {
      console.error('OCR Process Error:', error);
      return { success: false, error: 'İşlem sırasında hata oluştu.' };
    }
  }
}

const ocrService = new OCRService();
export default ocrService;
