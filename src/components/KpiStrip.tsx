import { Activity, Gauge, Radio, Clock } from 'lucide-react';
import type { Station } from '@/types';
import { aqiToColor, aqiToTextColor, formatTime } from '@/lib/aqiUtils';

interface KpiStripProps {
  overallAqi: number;
  overallPm25: number;
  activeStations: number;
  lastUpdated: string;
  stations: Station[];
}

function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  iconColor,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  iconColor: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-3 md:p-4 flex items-center gap-3 hover:border-airsense-primary/30 transition-colors animate-fade-in">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}15` }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] md:text-xs uppercase tracking-wider font-mono"
          style={{ color: 'var(--airsense-text-muted)' }}
        >
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-lg md:text-2xl font-bold font-mono ${color ?? ''}`}
            style={{ color: 'var(--airsense-text)' }}
          >
            {value}
          </span>
          {unit && (
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--airsense-text-muted)' }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KpiStrip({
  overallAqi,
  overallPm25,
  activeStations,
  lastUpdated,
}: KpiStripProps) {
  const aqiColor = aqiToColor(overallAqi);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        icon={Gauge}
        label="Current AQI"
        value={overallAqi}
        iconColor={aqiColor}
        color={aqiToTextColor(overallAqi)}
      />
      <KpiCard
        icon={Activity}
        label="PM2.5"
        value={overallPm25}
        unit="µg/m³"
        iconColor="#00d4ff"
      />
      <KpiCard
        icon={Radio}
        label="Active Stations"
        value={activeStations}
        iconColor="#00cc66"
      />
      <KpiCard
        icon={Clock}
        label="Last Updated"
        value={formatTime(lastUpdated)}
        iconColor="#ffaa00"
      />
    </div>
  );
}
