/**
 * Fatura Sağlayıcıları API Entegrasyonu
 * GSM, Elektrik, Doğalgaz, Su faturaları için API bağlantıları
 */

export interface BillProvider {
  id: string;
  name: string;
  type: 'gsm' | 'electricity' | 'gas' | 'water';
  logo: string;
  apiEndpoint?: string;
  requiresAuth: boolean;
  authType: 'username_password' | 'api_key' | 'oauth' | 'customer_number';
  status: 'active' | 'inactive' | 'maintenance';
  features: string[];
}

export interface BillCredentials {
  providerId: string;
  customerId?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  contractNumber?: string;
  additionalFields?: Record<string, string>;
}

export interface Bill {
  id: string;
  providerId: string;
  providerName: string;
  billType: 'gsm' | 'electricity' | 'gas' | 'water';
  billNumber: string;
  period: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
  pdfUrl?: string;
  details?: {
    previousReading?: number;
    currentReading?: number;
    consumption?: number;
    unit?: string;
  };
}

export interface BillFetchResult {
  success: boolean;
  bills?: Bill[];
  error?: string;
  providerId: string;
}

// Türkiye Fatura Sağlayıcıları Listesi
export const BILL_PROVIDERS: BillProvider[] = [
  // GSM Operatörleri
  {
    id: 'turkcell',
    name: 'Turkcell',
    type: 'gsm',
    logo: '/providers/turkcell.svg',
    apiEndpoint: 'https://api.turkcell.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'username_password',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'vodafone',
    name: 'Vodafone TR',
    type: 'gsm',
    logo: '/providers/vodafone.svg',
    apiEndpoint: 'https://api.vodafone.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'username_password',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'turktelekom',
    name: 'Türk Telekom',
    type: 'gsm',
    logo: '/providers/turktelekom.svg',
    apiEndpoint: 'https://api.turktelekom.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'username_password',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },

  // Elektrik Şirketleri
  {
    id: 'enerjisa',
    name: 'EnerjiSA',
    type: 'electricity',
    logo: '/providers/enerjisa.svg',
    apiEndpoint: 'https://api.enerjisa.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme', 'tuketim_analizi']
  },
  {
    id: 'ayedas',
    name: 'AEDAŞ',
    type: 'electricity',
    logo: '/providers/ayedas.svg',
    apiEndpoint: 'https://api.ayedas.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'bogazici_elektrik',
    name: 'Boğaziçi Elektrik',
    type: 'electricity',
    logo: '/providers/bogazici-elektrik.svg',
    apiEndpoint: 'https://api.bogazici-elektrik.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },

  // Doğalgaz Şirketleri
  {
    id: 'igdas',
    name: 'İGDAŞ',
    type: 'gas',
    logo: '/providers/igdas.svg',
    apiEndpoint: 'https://api.igdas.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme', 'tuketim_analizi']
  },
  {
    id: 'esgas',
    name: 'ESGAZ',
    type: 'gas',
    logo: '/providers/esgas.svg',
    apiEndpoint: 'https://api.esgas.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'baskentdogalgaz',
    name: 'Başkent Doğalgaz',
    type: 'gas',
    logo: '/providers/baskentdogalgaz.svg',
    apiEndpoint: 'https://api.baskentdogalgaz.com.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },

  // Su Şirketleri
  {
    id: 'iski',
    name: 'İSKİ',
    type: 'water',
    logo: '/providers/iski.svg',
    apiEndpoint: 'https://api.iski.gov.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'aski',
    name: 'ASKİ',
    type: 'water',
    logo: '/providers/aski.svg',
    apiEndpoint: 'https://api.ankara.bel.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
  {
    id: 'izsu',
    name: 'İZSU',
    type: 'water',
    logo: '/providers/izsu.svg',
    apiEndpoint: 'https://api.izsu.gov.tr/v1/bills',
    requiresAuth: true,
    authType: 'customer_number',
    status: 'active',
    features: ['fatura_sorgula', 'gecmis_faturalar', 'otomatik_cekme']
  },
];

/**
 * Fatura Sağlayıcı API Servisi
 */
class BillProviderService {
  private credentials: Map<string, BillCredentials> = new Map();

  /**
   * Sağlayıcıya giriş yap
   */
  async authenticate(providerId: string, credentials: BillCredentials): Promise<{ success: boolean; error?: string }> {
    const provider = BILL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Sağlayıcı bulunamadı' };
    }

    try {
      // Simülasyon - Gerçek API entegrasyonu için burası güncellenmeli
      // Örnek API çağrısı:
      // const response = await fetch(provider.apiEndpoint + '/auth', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      
      // Simülasyon: Başarılı giriş
      this.credentials.set(providerId, credentials);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Kimlik doğrulama başarısız' 
      };
    }
  }

  /**
   * Faturaları çek
   */
  async fetchBills(providerId: string, options?: { startDate?: string; endDate?: string }): Promise<BillFetchResult> {
    const provider = BILL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Sağlayıcı bulunamadı', providerId };
    }

    const credentials = this.credentials.get(providerId);
    if (!credentials) {
      return { success: false, error: 'Lütfen önce sağlayıcıya giriş yapın', providerId };
    }

    try {
      // Simülasyon - Gerçek API entegrasyonu için burası güncellenmeli
      // Örnek API çağrısı:
      // const response = await fetch(provider.apiEndpoint + '/bills', {
      //   method: 'GET',
      //   headers: { 
      //     'Authorization': `Bearer ${credentials.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(options)
      // });
      
      // Simülasyon: Örnek faturalar
      const mockBills = this.generateMockBills(provider);
      
      return { 
        success: true, 
        bills: mockBills,
        providerId 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Fatura çekme başarısız',
        providerId 
      };
    }
  }

  /**
   * Tüm sağlayıcılardan faturaları çek
   */
  async fetchAllBills(options?: { startDate?: string; endDate?: string }): Promise<BillFetchResult[]> {
    const results: BillFetchResult[] = [];
    
    for (const provider of BILL_PROVIDERS) {
      if (provider.status === 'active' && this.credentials.has(provider.id)) {
        const result = await this.fetchBills(provider.id, options);
        results.push(result);
      }
    }
    
    return results;
  }

  /**
   * Fatura detayını al
   */
  async getBillDetails(providerId: string, billId: string): Promise<{ success: boolean; bill?: Bill; error?: string }> {
    const provider = BILL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Sağlayıcı bulunamadı' };
    }

    const credentials = this.credentials.get(providerId);
    if (!credentials) {
      return { success: false, error: 'Lütfen önce sağlayıcıya giriş yapın' };
    }

    try {
      // Simülasyon - Gerçek API entegrasyonu için burası güncellenmeli
      const bills = await this.fetchBills(providerId);
      const bill = bills.bills?.find(b => b.id === billId);
      
      if (bill) {
        return { success: true, bill };
      } else {
        return { success: false, error: 'Fatura bulunamadı' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Fatura detayı alınamadı' 
      };
    }
  }

  /**
   * Fatura PDF'ini indir
   */
  async downloadBillPDF(providerId: string, billId: string): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
    const provider = BILL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Sağlayıcı bulunamadı' };
    }

    const credentials = this.credentials.get(providerId);
    if (!credentials) {
      return { success: false, error: 'Lütfen önce sağlayıcıya giriş yapın' };
    }

    try {
      // Simülasyon - Gerçek API entegrasyonu için burası güncellenmeli
      const billResult = await this.getBillDetails(providerId, billId);
      
      if (billResult.success && billResult.bill) {
        return { 
          success: true, 
          pdfUrl: billResult.bill.pdfUrl || `/bills/${providerId}/${billId}.pdf`
        };
      } else {
        return { success: false, error: 'PDF indirilemedi' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'PDF indirme başarısız' 
      };
    }
  }

  /**
   * Bağlantıyı test et
   */
  async testConnection(providerId: string): Promise<{ success: boolean; error?: string }> {
    const provider = BILL_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Sağlayıcı bulunamadı' };
    }

    const credentials = this.credentials.get(providerId);
    if (!credentials) {
      return { success: false, error: 'Lütfen önce sağlayıcıya giriş yapın' };
    }

    try {
      // Simülasyon - Gerçek API entegrasyonu için burası güncellenmeli
      // Örnek API çağrısı:
      // const response = await fetch(provider.apiEndpoint + '/test', {
      //   method: 'GET',
      //   headers: { 'Authorization': `Bearer ${credentials.apiKey}` }
      // });
      
      // Simülasyon: Başarılı bağlantı
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bağlantı testi başarısız' 
      };
    }
  }

  /**
   * Kimlik bilgilerini kaydet
   */
  saveCredentials(providerId: string, credentials: BillCredentials): void {
    this.credentials.set(providerId, credentials);
  }

  /**
   * Kimlik bilgilerini kaldır
   */
  removeCredentials(providerId: string): void {
    this.credentials.delete(providerId);
  }

  /**
   * Kayıtlı kimlik bilgilerini al
   */
  getCredentials(providerId: string): BillCredentials | undefined {
    return this.credentials.get(providerId);
  }

  /**
   * Tüm kayıtlı sağlayıcıları al
   */
  getActiveProviders(): string[] {
    return Array.from(this.credentials.keys());
  }

  /**
   * Sağlayıcıları filtrele
   */
  filterProviders(type?: 'gsm' | 'electricity' | 'gas' | 'water'): BillProvider[] {
    if (type) {
      return BILL_PROVIDERS.filter(p => p.type === type);
    }
    return BILL_PROVIDERS;
  }

  /**
   * Mock fatura oluştur (simülasyon için)
   */
  private generateMockBills(provider: BillProvider): Bill[] {
    const now = new Date();
    const bills: Bill[] = [];

    // Son 3 ay için fatura oluştur
    for (let i = 0; i < 3; i++) {
      const billDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const dueDate = new Date(billDate);
      dueDate.setDate(dueDate.getDate() + 10);

      const amount = this.getMockAmount(provider.type);
      const status = i === 0 ? 'pending' : (i === 1 ? 'paid' : 'paid');

      bills.push({
        id: `${provider.id}-${billDate.getFullYear()}-${billDate.getMonth() + 1}`,
        providerId: provider.id,
        providerName: provider.name,
        billType: provider.type,
        billNumber: `FTR-${billDate.getFullYear()}${String(billDate.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`,
        period: `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: amount,
        currency: 'TRY',
        status: status,
        pdfUrl: `/bills/${provider.id}/${billDate.getFullYear()}-${billDate.getMonth() + 1}.pdf`,
        details: this.getMockDetails(provider.type)
      });
    }

    return bills;
  }

  /**
   * Mock tutar al (simülasyon için)
   */
  private getMockAmount(type: string): number {
    const amounts: Record<string, number[]> = {
      gsm: [150, 200, 250, 300, 350, 400],
      electricity: [300, 400, 500, 600, 700, 800],
      gas: [200, 300, 400, 500, 600, 700],
      water: [50, 75, 100, 125, 150, 175]
    };

    const typeAmounts = amounts[type] || [100, 200, 300];
    return typeAmounts[Math.floor(Math.random() * typeAmounts.length)];
  }

  /**
   * Mock detaylar al (simülasyon için)
   */
  private getMockDetails(type: string) {
    const details: Record<string, any> = {
      gsm: {
        previousReading: 1000,
        currentReading: 1200,
        consumption: 200,
        unit: 'dakika'
      },
      electricity: {
        previousReading: 5000,
        currentReading: 5500,
        consumption: 500,
        unit: 'kWh'
      },
      gas: {
        previousReading: 100,
        currentReading: 120,
        consumption: 20,
        unit: 'm³'
      },
      water: {
        previousReading: 50,
        currentReading: 60,
        consumption: 10,
        unit: 'm³'
      }
    };

    return details[type] || {};
  }
}

// Singleton instance
export const billProviderService = new BillProviderService();

// Helper functions
export const getProviderById = (id: string): BillProvider | undefined => {
  return BILL_PROVIDERS.find(p => p.id === id);
};

export const getProvidersByType = (type: 'gsm' | 'electricity' | 'gas' | 'water'): BillProvider[] => {
  return BILL_PROVIDERS.filter(p => p.type === type);
};

export const getActiveProviders = (): BillProvider[] => {
  return BILL_PROVIDERS.filter(p => p.status === 'active');
};
