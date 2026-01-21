/**
 * GİB (Gelir İdaresi Başkanlığı) e-Fatura API Entegrasyonu
 * 
 * Bu modül, GİB e-Fatura sistemine bağlantı sağlar.
 * Gerçek üretim ortamında GİB'nin resmi API'si kullanılmalıdır.
 */

export interface GIBConfig {
  username: string;
  password: string;
  vkn: string; // Vergi Kimlik Numarası
  alias: string; // Portal Alias
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: 'SATIS' | 'ALIS';
  customerVkn: string;
  customerName: string;
  customerTaxOffice: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number;
}

export interface GIBResponse {
  success: boolean;
  uuid?: string;
  status?: 'SUCCESS' | 'PENDING' | 'ERROR';
  code?: string;
  message?: string;
}

class GIBService {
  private config: GIBConfig | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.GIB_API_URL || 'https://efatura-test.gib.gov.tr';
  }

  /**
   * Servisi belirli bir şirket yapılandırmasıyla ilklendirir
   */
  async initializeWithCompany(companyId: string): Promise<boolean> {
    try {
      const Company = (await import('@/models/Company')).default;
      const connectDB = (await import('@/lib/mongodb')).default;

      await connectDB();
      const company = await Company.findById(companyId);

      if (!company || !company.gibUsername || !company.gibPassword) {
        console.warn('GİB yapılandırması eksik');
        return false;
      }

      this.config = {
        vkn: company.taxNumber,
        username: company.gibUsername,
        password: company.gibPassword,
        alias: company.gibAlias || 'default'
      };

      return true;
    } catch (error) {
      console.error('GİB Servis İlklendirme Hatası:', error);
      return false;
    }
  }

  /**
   * GİB API'ye bağlanır ve yapılandırır
   */
  async connect(config?: GIBConfig): Promise<boolean> {
    try {
      if (config) this.config = config;

      if (!this.config) {
        console.warn('GİB yapılandırması bulunamadı. Önce initializeWithCompany çağrılmalı veya config geçilmeli.');
        return false;
      }

      console.log('GİB API bağlantısı kuruluyor...', { vkn: this.config.vkn, alias: this.config.alias });

      // Simülasyon gecikmesi
      await new Promise(resolve => setTimeout(resolve, 800));

      return true;
    } catch (error) {
      console.error('GİB API bağlantı hatası:', error);
      return false;
    }
  }

  /**
   * E-Fatura gönderir (Simülasyon)
   */
  async sendInvoice(invoiceData: InvoiceData): Promise<GIBResponse> {
    try {
      console.log('E-Fatura GİB sistemine gönderiliyor:', invoiceData.invoiceNumber);

      // Simülasyon gecikmesi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // %10 olasılıkla hata simülasyonu
      if (Math.random() < 0.1) {
        return {
          success: false,
          code: '1161',
          message: 'Hatalı VKN/TCKN formatı veya geçersiz mükellef.',
          status: 'ERROR'
        };
      }

      const uuid = `EFAT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      return {
        success: true,
        uuid,
        status: 'SUCCESS',
        code: '1000',
        message: 'Fatura başarıyla GİB sistemine iletildi.'
      };
    } catch (error) {
      console.error('GİB Gönderim Hatası:', error);
      return { success: false, message: 'Fatura gönderilirken teknik bir hata oluştu.', status: 'ERROR' };
    }
  }

  /**
   * Fatura durumunu sorgular (Simülasyon)
   */
  async getInvoiceStatus(uuid: string): Promise<GIBResponse> {
    const statuses: Array<'SUCCESS' | 'PENDING' | 'ERROR'> = ['SUCCESS', 'PENDING', 'SUCCESS', 'SUCCESS'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      success: true,
      uuid,
      status: randomStatus,
      message: randomStatus === 'SUCCESS' ? 'Fatura onaylandı.' : 'Fatura kuyrukta bekliyor.',
      code: randomStatus === 'SUCCESS' ? '1200' : '1100'
    };
  }

  /**
   * E-Fatura PDF içeriğini simüle eder
   */
  async getInvoicePDF(uuid: string): Promise<string> {
    return `SIMULATED_PDF_CONTENT_FOR_${uuid}`;
  }
}

const gibService = new GIBService();
export default gibService;
