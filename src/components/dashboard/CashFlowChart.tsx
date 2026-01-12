'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function CashFlowChart() {
  const data = [
    { date: '01.06', inflow: 15000, outflow: 8000, balance: 50000 },
    { date: '05.06', inflow: 22000, outflow: 12000, balance: 60000 },
    { date: '10.06', inflow: 18000, outflow: 15000, balance: 63000 },
    { date: '15.06', inflow: 25000, outflow: 18000, balance: 70000 },
    { date: '20.06', inflow: 20000, outflow: 14000, balance: 76000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nakit Akışı Grafiği</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₺${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number | undefined) => `₺${value?.toLocaleString() || 0}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="inflow" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Giriş"
              dot={{ fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="outflow" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Çıkış"
              dot={{ fill: '#ef4444' }}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Bakiye"
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
