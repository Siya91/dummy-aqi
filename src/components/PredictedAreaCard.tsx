import { Satellite, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import type { PredictedArea } from '@/types';
import { aqiToColor, formatTimestamp } from '@/lib/aqiUtils';

interface PredictedAreaCardProps {
  area: PredictedArea;
}

export default function PredictedAreaCard({ area }: PredictedAreaCardProps) {
  const color = aqiToColor(area.aqi);

  const trend = area.trend;
  const recent = trend.slice(-6);
  const prev = trend.slice(-12, -6);
  const recentAvg = recent.reduce((s, p) => s + p.pm25, 0) / recent.length;
  const prevAvg = prev.length
    ? prev.reduce((s, p) => s + p.pm25, 0) / prev.length
    : recentAvg;
  const trendDelta = recentAvg - prevAvg;
  const trendUp = trendDelta > 0;

  return (
    <div className="glass-panel rounded-xl p-4 animate-slide-up border-dashed border-airsense-accent/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-airsense-accent/15 flex items-center justify-center">
            <Satellite className="w-4 h-4 text-airsense-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--airsense-text)' }}>{area.name}</h3>
            <p className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
              {area.area_id} · {area.lat.toFixed(4)}°N, {area.lng.toFixed(4)}°E
            </p>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded-md text-xs font-bold font-mono"
          style={{ background: `${color}20`, color }}
        >
          {area.aqi}
        </div>
      </div>

      {/* Predicted badge */}
      <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-md bg-airsense-accent/10 border border-airsense-accent/20">
        <AlertCircle className="w-3 h-3 text-airsense-accent flex-shrink-0" />
        <p className="text-[10px] text-airsense-accent leading-tight">
          No CPCB station in this area — estimate from satellite fusion model
        </p>
      </div>

      {/* AQI gauge bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: 'var(--airsense-text-muted)' }}>AQI Category</span>
          <span className="text-xs font-medium" style={{ color }}>
            {area.category}
          </span>
        </div>
        <div className="h-2 rounded-full bg-airsense-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (area.aqi / 300) * 100)}%`,
              background: color,
            }}
          />
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-airsense-surface-2/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3 h-3 text-airsense-accent" />
            <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--airsense-text-muted)' }}>PM2.5</span>
          </div>
          <div className="text-lg font-bold font-mono" style={{ color: 'var(--airsense-text)' }}>
            {area.pm25}
            <span className="text-xs ml-1" style={{ color: 'var(--airsense-text-muted)' }}>µg/m³</span>
          </div>
        </div>
        <div className="bg-airsense-surface-2/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-airsense-warning" />
            <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Trend</span>
          </div>
          <div
            className={`text-lg font-bold font-mono ${
              trendUp ? 'text-airsense-danger' : 'text-airsense-safe'
            }`}
          >
            {trendUp ? '↑' : '↓'} {Math.abs(trendDelta).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Confidence + footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-airsense-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
            <span>Model confidence:</span>
            <span className="text-airsense-accent font-bold">
              {(area.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
          {formatTimestamp(area.timestamp)}
        </div>
      </div>
    </div>
  );
}
