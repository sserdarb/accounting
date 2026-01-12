// Kullanıcı tipleri
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Firma tipleri
export interface Company {
  id: string;
  name: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  gibUsername?: string;
  gibPassword?: string;
  gibAlias?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fatura tipleri
export type InvoiceType = 'sales' | 'purchase';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  companyId: string;
  customerId?: string;
  supplierId?: string;
  customerName?: string;
  supplierName?: string;
  customerTaxNumber?: string;
  supplierTaxNumber?: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  withholdingRate?: number;
  withholdingAmount?: number;
  total: number;
  notes?: string;
  gibUuid?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

// Cari hesap tipleri
export type ContactType = 'customer' | 'supplier';

export interface Contact {
  id: string;
  type: ContactType;
  name: string;
  taxNumber?: string;
  taxOffice?: string;
  address?: string;
  phone?: string;
  email?: string;
  companyId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Banka hesap tipleri
export interface BankAccount {
  id: string;
  companyId: string;
  bankName: string;
  branchName?: string;
  accountNumber: string;
  iban: string;
  currency: 'TRY' | 'USD' | 'EUR';
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Kasa hareket tipleri
export type CashTransactionType = 'income' | 'expense';

export interface CashTransaction {
  id: string;
  companyId: string;
  type: CashTransactionType;
  amount: number;
  description: string;
  category?: string;
  date: Date;
  createdAt: Date;
}

// Bildirim tipleri
export interface Notification {
  id: string;
  userId: string;
  type: 'invoice' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Rapor tipleri
export interface Report {
  period: string;
  totalSales: number;
  totalPurchases: number;
  totalVat: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

// OCR sonuç tipleri
export interface OCRResult {
  success: boolean;
  data?: {
    companyName?: string;
    taxNumber?: string;
    taxOffice?: string;
    date?: string;
    invoiceNumber?: string;
    total?: number;
    vatRate?: number;
    vatAmount?: number;
    items?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
  error?: string;
}

// Gmail entegrasyon tipleri
export interface EmailAttachment {
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface ParsedInvoice {
  invoiceNumber?: string;
  date?: string;
  total?: number;
  vatAmount?: number;
  companyName?: string;
  taxNumber?: string;
}
