import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StockChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.date.substring(5), // Show MM-DD
    Price: parseFloat(item.predictedPrice),
    interval: [parseFloat(item.confidenceIntervalLow), parseFloat(item.confidenceIntervalHigh)]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-xl shadow-xl border border-slate-700/50">
          <p className="font-semibold text-slate-200 mb-2">{label}</p>
          <p className="text-primary font-bold">
            Predicted: ${payload[1]?.value || payload[0]?.value}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Range: ${payload[0]?.value[0]} - ${payload[0]?.value[1]}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
      >
        <defs>
          <linearGradient id="colorInterval" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          tick={{ fill: '#94a3b8' }} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          domain={['auto', 'auto']} 
          stroke="#94a3b8" 
          tick={{ fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* The Area acts as the confidence band */}
        <Area 
          type="monotone" 
          dataKey="interval" 
          stroke="none" 
          fill="url(#colorInterval)" 
          activeDot={false}
        />
        {/* The Line is the exact predicted price */}
        <Line 
          type="monotone" 
          dataKey="Price" 
          stroke="url(#lineGrad)" 
          strokeWidth={3}
          dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0, className: "animate-pulse" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
