import { MapPin, Activity, Wind, TrendingUp } from 'lucide-react';
import type { Station } from '@/types';
import { aqiToColor, aqiToTextColor, formatTimestamp } from '@/lib/aqiUtils';

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const color = aqiToColor(station.aqi);

  // Compute trend direction
  const trend = station.trend;
  const recent = trend.slice(-6);
  const prev = trend.slice(-12, -6);
  const recentAvg = recent.reduce((s, p) => s + p.pm25, 0) / recent.length;
  const prevAvg = prev.length
    ? prev.reduce((s, p) => s + p.pm25, 0) / prev.length
    : recentAvg;
  const trendDelta = recentAvg - prevAvg;
  const trendUp = trendDelta > 0;

  return (
    <div className="glass-panel rounded-xl p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-airsense-accent" />
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--airsense-text)' }}>{station.name}</h3>
            <p className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
              {station.station_id} · {station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E
            </p>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded-md text-xs font-bold font-mono"
          style={{ background: `${color}20`, color }}
        >
          {station.aqi}
        </div>
      </div>

      {/* AQI gauge bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: 'var(--airsense-text-muted)' }}>AQI Category</span>
          <span className="text-xs font-medium" style={{ color }}>
            {station.category}
          </span>
        </div>
        <div className="h-2 rounded-full bg-airsense-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (station.aqi / 300) * 100)}%`,
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
            {station.pm25}
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

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-airsense-border">
        <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
          <Wind className="w-3 h-3" />
          <span>Updated {formatTimestamp(station.timestamp)}</span>
        </div>
        <div className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
          {station.trend.length}h history
        </div>
      </div>
    </div>
  );
}
