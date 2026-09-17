import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import type { TrendPoint } from '@/types';

interface TrendChartProps {
  data: TrendPoint[];
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <div className="text-gray-400 font-mono mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-airsense-accent" />
        <span className="text-white font-mono font-bold">
          {payload[0].value} µg/m³
        </span>
      </div>
    </div>
  );
}

export default function TrendChart({ data, height = 200 }: TrendChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a" opacity={0.4} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#5a6a80', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: '#1a2a4a' }}
            axisLine={{ stroke: '#1a2a4a' }}
            interval={3}
          />
          <YAxis
            tick={{ fill: '#5a6a80', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: '#1a2a4a' }}
            axisLine={{ stroke: '#1a2a4a' }}
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="pm25"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#pm25Gradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#00d4ff', stroke: '#060d1a', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="pm25"
            stroke="#00d4ff"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
