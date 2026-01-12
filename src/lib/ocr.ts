/**
 * OCR (Optical Character Recognition) Servisi
 * 
 * Bu modül, fatura görsellerinden metin çıkarma yapar.
 * Google Vision API veya Tesseract kullanılabilir.
 */

interface OCRConfig {
  provider: 'google-vision' | 'tesseract';
  apiKey?: string; // Google Vision API için
}

interface OCRResult {
  success: boolean;
  text?: string;
  confidence?: number;
  error?: string;
}

interface ParsedInvoiceData {
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

  /**
   * OCR servisini yapılandırır
   */
  configure(config: OCRConfig): void {
    this.config = config;
    console.log('OCR servisi yapılandırıldı:', config);
  }

  /**
   * Resimden metin çıkarır (Google Vision API)
   */
  async extractTextFromImageGoogleVision(imageBase64: string): Promise<OCRResult> {
    try {
      if (!this.config || !this.config.apiKey) {
        return { success: false, error: 'Google Vision API anahtarı yok' };
      }

      console.log('Google Vision API ile metin çıkarılıyor...');

      // TODO: Gerçek API çağrısı
      // const response = await axios.post(
      //   `https://vision.googleapis.com/v1/images:annotate?key=${this.config.apiKey}`,
      //   {
      //     requests: [
      //       {
      //         image: {
      //           content: imageBase64,
      //         },
      //         features: [
      //           {
      //             type: 'TEXT_DETECTION',
      //             maxResults: 1,
      //           },
      //         ],
      //       },
      //     ],
      //   }
      // );

      // Simülasyon
      return {
        success: true,
        text: 'FATURA NO: 12345\nMÜŞTERİ: ABC Ltd. Şti.\nTARİH: 01.01.2024\nTUTAR: ₺1,200.00',
        confidence: 0.95,
      };
    } catch (error) {
      console.error('Google Vision API hatası:', error);
      return { success: false, error: 'Metin çıkarılamadı' };
    }
  }

  /**
   * Resimden metin çıkarır (Tesseract.js)
   */
  async extractTextFromImageTesseract(imageBase64: string): Promise<OCRResult> {
    try {
      console.log('Tesseract ile metin çıkarılıyor...');

      // TODO: Tesseract.js entegrasyonu
      // const worker = await Tesseract.createWorker('tur');
      // const { data: { text, confidence } } = await worker.recognize(imageBase64);
      // await worker.terminate();

      // Simülasyon
      return {
        success: true,
        text: 'FATURA NO: 12345\nMÜŞTERİ: ABC Ltd. Şti.\nTARİH: 01.01.2024\nTUTAR: ₺1,200.00',
        confidence: 0.85,
      };
    } catch (error) {
      console.error('Tesseract hatası:', error);
      return { success: false, error: 'Metin çıkarılamadı' };
    }
  }

  /**
   * Resimden metin çıkarır (seçilen provider'a göre)
   */
  async extractTextFromImage(imageBase64: string): Promise<OCRResult> {
    if (!this.config) {
      return { success: false, error: 'OCR servisi yapılandırılmadı' };
    }

    if (this.config.provider === 'google-vision') {
      return await this.extractTextFromImageGoogleVision(imageBase64);
    } else {
      return await this.extractTextFromImageTesseract(imageBase64);
    }
  }

  /**
   * PDF'den metin çıkarır
   */
  async extractTextFromPDF(pdfBase64: string): Promise<OCRResult> {
    try {
      console.log('PDF\'den metin çıkarılıyor...');

      // TODO: PDF parsing entegrasyonu
      // const pdfjsLib = await import('pdfjs-dist');
      // const pdf = await pdfjsLib.getDocument({ data: pdfBase64 }).promise;
      // let fullText = '';
      // for (let i = 1; i <= pdf.numPages; i++) {
      //   const page = await pdf.getPage(i);
      //   const textContent = await page.getTextContent();
      //   const pageText = textContent.items.map((item: any) => item.str).join(' ');
      //   fullText += pageText + '\n';
      // }

      // Simülasyon
      return {
        success: true,
        text: 'FATURA NO: 12345\nMÜŞTERİ: ABC Ltd. Şti.\nTARİH: 01.01.2024\nTUTAR: ₺1,200.00',
        confidence: 0.90,
      };
    } catch (error) {
      console.error('PDF metin çıkarma hatası:', error);
      return { success: false, error: 'PDF\'den metin çıkarılamadı' };
    }
  }

  /**
   * Çıkarılan metinden fatura bilgilerini ayrıştırır
   */
  async parseInvoiceFromText(text: string): Promise<ParsedInvoiceData | null> {
    try {
      console.log('Metinden fatura bilgisi ayrıştırılıyor...');

      const lines = text.split('\n');
      const result: ParsedInvoiceData = {};

      // Firma adı tespiti
      const companyPatterns = [
        /(?:MÜŞTERİ|FİRMA|ŞİRKET)[:\s]+([A-ZÇĞİÖŞÜ\s]+(?:Ltd\.|A\.Ş\.|Şti\.|Tic\.))/i,
        /([A-ZÇĞİÖŞÜ\s]+(?:Ltd\.|A\.Ş\.|Şti\.|Tic\.))/i,
      ];
      for (const pattern of companyPatterns) {
        const match = text.match(pattern);
        if (match) {
          result.customerName = match[1] || match[0];
          break;
        }
      }

      // Vergi numarası tespiti
      const taxNumberPatterns = [
        /(?:VKN|VERGİ\s*NO|Vergi\s*Numarası)[:\s]*(\d{10})/i,
        /V\.K\.N\.[:\s]*(\d{10})/i,
      ];
      for (const pattern of taxNumberPatterns) {
        const match = text.match(pattern);
        if (match) {
          result.taxNumber = match[1];
          break;
        }
      }

      // Tarih tespiti
      const datePatterns = [
        /(?:TARİH|DATE|FATURA\s*TARİHİ)[:\s]*(\d{2}[./-]\d{2}[./-]\d{4})/i,
        /(\d{2}[./-]\d{2}[./-]\d{4})/,
      ];
      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          result.date = match[1];
          break;
        }
      }

      // Fatura numarası tespiti
      const invoiceNumberPatterns = [
        /(?:FATURA\s*NO|FATURA\s*NUMARASI|INVOICE\s*NO)[:\s]*([A-Z0-9-]+)/i,
        /FATURA[:\s]*([A-Z0-9-]+)/i,
      ];
      for (const pattern of invoiceNumberPatterns) {
        const match = text.match(pattern);
        if (match) {
          result.invoiceNumber = match[1];
          break;
        }
      }

      // Tutar tespiti
      const amountPatterns = [
        /(?:TOPLAM|TUTAR|TOTAL|AMOUNT)[:\s]*₺?[\s]*(\d+[.,]\d{2})/i,
        /₺[\s]*(\d+[.,]\d{2})/,
      ];
      for (const pattern of amountPatterns) {
        const match = text.match(pattern);
        if (match) {
          result.total = parseFloat(match[1].replace(',', '.'));
          break;
        }
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      console.error('Fatura bilgisi ayrıştırma hatası:', error);
      return null;
    }
  }

  /**
   * Dosyadan fatura bilgilerini çıkarır (tam akış)
   */
  async extractInvoiceFromFile(file: File): Promise<{
    success: boolean;
    data?: ParsedInvoiceData;
    error?: string;
  }> {
    try {
      // Dosyayı base64'e çevir
      const base64 = await this.fileToBase64(file);

      let ocrResult: OCRResult;

      // Dosya tipine göre işlem yap
      if (file.type === 'application/pdf') {
        ocrResult = await this.extractTextFromPDF(base64);
      } else if (file.type.startsWith('image/')) {
        ocrResult = await this.extractTextFromImage(base64);
      } else {
        return { success: false, error: 'Desteklenmeyen dosya formatı' };
      }

      if (!ocrResult.success) {
        return { success: false, error: ocrResult.error };
      }

      // Metinden fatura bilgisi çıkar
      const parsedData = await this.parseInvoiceFromText(ocrResult.text || '');

      return {
        success: true,
        data: parsedData || undefined,
      };
    } catch (error) {
      console.error('Dosyadan fatura çıkarma hatası:', error);
      return { success: false, error: 'Fatura çıkarılamadı' };
    }
  }

  /**
   * Dosyayı base64'e çevirir
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Singleton instance
const ocrService = new OCRService();

export default ocrService;
