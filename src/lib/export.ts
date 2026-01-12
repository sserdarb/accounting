import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// PDF Export Fonksiyonları
export interface PDFExportData {
  title: string;
  subtitle?: string;
  headers: string[];
  data: any[][];
  fileName?: string;
}

export const exportToPDF = ({ title, subtitle, headers, data, fileName = 'rapor' }: PDFExportData) => {
  const doc = new jsPDF();
  
  // Başlık
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(subtitle, 14, 30);
  }
  
  // Tarih
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 14, 38);
  
  // Tablo
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 45,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 45, left: 14, right: 14 },
  });
  
  // Dosyayı kaydet
  doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Excel Export Fonksiyonları
export interface ExcelExportData {
  title: string;
  headers: string[];
  data: any[][];
  fileName?: string;
}

export const exportToExcel = ({ title, headers, data, fileName = 'rapor' }: ExcelExportData) => {
  // Çalışma kitabı oluştur
  const wb = XLSX.utils.book_new();
  
  // Başlık satırı
  const titleRow = [[title], [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`]];
  
  // Veriyi birleştir
  const wsData = [...titleRow, headers, ...data];
  
  // Çalışma sayfası oluştur
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Sütun genişliklerini ayarla
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  
  // Çalışma sayfasını kitaba ekle
  XLSX.utils.book_append_sheet(wb, ws, 'Rapor');
  
  // Dosyayı kaydet
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Rapor verileri için yardımcı fonksiyonlar
export const prepareRevenueReportData = (revenueData: any[]) => {
  return {
    title: 'Gelir-Gider Raporu',
    subtitle: 'Aylık gelir ve gider özeti',
    headers: ['Ay', 'Gelir', 'Gider', 'Kâr', 'Kâr Oranı'],
    data: revenueData.map(item => [
      item.month,
      `₺${item.revenue.toLocaleString()}`,
      `₺${item.expense.toLocaleString()}`,
      `₺${item.profit.toLocaleString()}`,
      `%${((item.profit / item.revenue) * 100).toFixed(1)}`
    ])
  };
};

export const prepareVATReportData = (vatData: any[]) => {
  return {
    title: 'KDV Raporu',
    subtitle: 'KDV oranlarına göre dağılım',
    headers: ['KDV Oranı', 'Toplam Tutar', 'Fatura Sayısı', 'Dağılım'],
    data: vatData.map(item => [
      item.rate,
      `₺${item.amount.toLocaleString()}`,
      item.count,
      `%${((item.amount / vatData.reduce((sum: number, d: any) => sum + d.amount, 0)) * 100).toFixed(1)}`
    ])
  };
};

export const prepareCustomerReportData = (customers: any[]) => {
  return {
    title: 'Müşteri Analizi Raporu',
    subtitle: 'En çok iş yapan müşteriler',
    headers: ['Müşteri', 'Toplam Tutar', 'Fatura Sayısı', 'Son Fatura'],
    data: customers.map(customer => [
      customer.name,
      `₺${customer.total.toLocaleString()}`,
      customer.invoiceCount,
      customer.lastInvoice
    ])
  };
};

export const prepareCashFlowReportData = (cashFlowData: any[]) => {
  return {
    title: 'Nakit Akışı Raporu',
    subtitle: 'Giriş ve çıkış hareketleri',
    headers: ['Tarih', 'Giriş', 'Çıkış', 'Bakiye'],
    data: cashFlowData.map(item => [
      item.date,
      `₺${item.inflow.toLocaleString()}`,
      `₺${item.outflow.toLocaleString()}`,
      `₺${item.balance.toLocaleString()}`
    ])
  };
};
