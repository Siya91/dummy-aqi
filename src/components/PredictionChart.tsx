import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ForecastPoint } from '@/types';

interface PredictionChartProps {
  data: ForecastPoint[];
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs space-y-1">
      <div className="text-gray-400 font-mono">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-mono font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function PredictionChart({ data, height = 320 }: PredictionChartProps) {
  // Find the boundary between actual and predicted
  const boundaryIdx = data.findIndex((d) => d.actual === null);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: -16 }}>
          <defs>
            <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e90ff" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#1e90ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a" opacity={0.4} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#5a6a80', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: '#1a2a4a' }}
            axisLine={{ stroke: '#1a2a4a' }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
          />
          <YAxis
            tick={{ fill: '#5a6a80', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={{ stroke: '#1a2a4a' }}
            axisLine={{ stroke: '#1a2a4a' }}
            domain={[0, 'dataMax + 30']}
          />
          <Tooltip content={<CustomTooltip />} />
          {boundaryIdx > 0 && (
            <ReferenceLine
              x={data[boundaryIdx].date}
              stroke="#ffaa00"
              strokeDasharray="4 4"
              label={{
                value: 'Forecast →',
                fill: '#ffaa00',
                fontSize: 10,
                position: 'top',
              }}
            />
          )}
          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="confidenceHigh"
            stroke="none"
            fill="url(#confBand)"
            fillOpacity={1}
            dot={false}
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="confidenceLow"
            stroke="none"
            fill="#060d1a"
            fillOpacity={1}
            dot={false}
            activeDot={false}
          />
          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#00cc66"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#00cc66' }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          {/* Predicted line */}
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted"
            stroke="#1e90ff"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: '#1e90ff' }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
