'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function VATChart() {
  const data = [
    { rate: '%1', amount: 1200, count: 45 },
    { rate: '%8', amount: 8500, count: 120 },
    { rate: '%10', amount: 6300, count: 85 },
    { rate: '%18', amount: 18500, count: 200 },
    { rate: '%20', amount: 9200, count: 95 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FFC107', '#FF9800'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>KDV Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => entry.rate}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              name="KDV Tutarı"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend 
              verticalAlign="middle" 
              height={26} 
              iconType="circle" 
              layout="vertical" 
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
