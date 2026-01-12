import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Fatura Sistemi - Türkiye'nin En Kapsamlı Ön Muhasebe Çözümü",
  description: "Türkiye'deki firmalar için kapsamlı ön muhasebe ve e-fatura yönetim sistemi. GİB entegrasyonu, OCR fatura tanıma, Gmail entegrasyonu ve daha fazlası.",
  keywords: ["e-fatura", "ön muhasebe", "GİB entegrasyonu", "fatura yönetimi", "OCR", "Türkiye"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
