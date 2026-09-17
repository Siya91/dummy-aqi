import { Wind, AlertTriangle, Radio, ArrowRight } from 'lucide-react';
import type { Plume } from '@/types';
import { formatTimestamp } from '@/lib/aqiUtils';

interface PlumeListProps {
  plumes: Plume[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PlumeList({ plumes, selectedId, onSelect }: PlumeListProps) {
  if (plumes.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <Radio className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--airsense-text-muted)' }} />
        <p className="text-sm" style={{ color: 'var(--airsense-text-muted)' }}>No plumes detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
    <div className="flex items-center gap-2 mb-2 px-1">
        <AlertTriangle className="w-4 h-4 text-airsense-warning" />
        <span className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
          Detected Plumes ({plumes.length})
        </span>
      </div>
      {plumes.map((plume) => {
        const isSelected = plume.id === selectedId;
        return (
          <button
            key={plume.id}
            onClick={() => onSelect(plume.id)}
            className={`w-full text-left glass-panel rounded-xl p-3 transition-all duration-200 ${
              isSelected
                ? 'border-airsense-primary/40 glow-primary'
                : 'hover:border-airsense-primary/20'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${plume.transboundary ? 'bg-airsense-danger' : 'bg-airsense-warning'}`}
                  style={{ animation: 'pulse 2s infinite' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--airsense-text)' }}>
                  {plume.name}
                </span>
              </div>
              {plume.transboundary && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-airsense-danger/20 text-airsense-danger border border-airsense-danger/30">
                  TRANBOUNDARY
                </span>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1" style={{ color: 'var(--airsense-text-muted)' }}>
                <Wind className="w-3 h-3 text-airsense-accent" />
                <span className="font-mono">
                  {plume.windDirection}° @ {plume.windSpeed}m/s
                </span>
              </div>
              <div className="font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                HCHO: {(plume.hchoConcentration * 1e4).toFixed(2)}×10⁻⁴
              </div>
              <div className="flex items-center gap-1" style={{ color: 'var(--airsense-text-muted)' }}>
                <Radio className="w-3 h-3 text-airsense-safe" />
                <span className="font-mono">
                  Conf: {(plume.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="font-mono text-[10px]" style={{ color: 'var(--airsense-text-muted)' }}>
                {formatTimestamp(plume.detectedAt)}
              </div>
            </div>

            {/* Trajectory mini */}
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-airsense-border">
              <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Path:</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                {plume.trajectory[0][0].toFixed(2)}°N
              </span>
              <ArrowRight className="w-3 h-3" style={{ color: 'var(--airsense-text-muted)' }} />
              <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                {plume.trajectory[plume.trajectory.length - 1][0].toFixed(2)}°N
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
