"use client";

import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface RevenueChartProps {
  data: { _id: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = useMemo(() => {
    // Fill in missing days with 0 revenue if necessary
    // For simplicity, just format the existing data
    return data.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: item.revenue
    }));
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #1e293b',
              borderRadius: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#00f2ff' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#00f2ff" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
