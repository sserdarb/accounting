'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueChart() {
  const data = [
    { month: 'Ocak', revenue: 45000, expense: 28000 },
    { month: 'Şubat', revenue: 52000, expense: 31000 },
    { month: 'Mart', revenue: 48000, expense: 29000 },
    { month: 'Nisan', revenue: 61000, expense: 35000 },
    { month: 'Mayıs', revenue: 55000, expense: 32000 },
    { month: 'Haziran', revenue: 67000, expense: 38000 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gelir-Gider Grafiği</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert('PDF Export özelliği yakında aktif olacak')}>
              <Printer className="mr-2 h-4 w-4" />
              PDF Yazdır
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Excel Export özelliği yakında aktif olacak')}>
              <FileDown className="mr-2 h-4 w-4" />
              Excel İndir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="revenue" fill="#22c55e" name="Gelir" />
            <Bar dataKey="expense" fill="#ef4444" name="Gider" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
