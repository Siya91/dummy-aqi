import { Brain, Cpu, CheckCircle2, Clock } from 'lucide-react';
import type { ModelMetrics } from '@/types';

interface ModelInfoCardProps {
  models: ModelMetrics[];
}

export default function ModelInfoCard({ models }: ModelInfoCardProps) {
  return (
    <div className="glass-panel rounded-xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-airsense-accent" />
        <h3 className="font-semibold text-sm" style={{ color: 'var(--airsense-text)' }}>Model Information</h3>
      </div>

      <div className="space-y-3">
        {models.map((m) => {
          const isActive = m.status === 'active';
          const Icon = isActive ? Cpu : Clock;
          return (
            <div
              key={m.model}
              className={`rounded-lg p-3 border transition-colors ${
                isActive
                  ? 'bg-airsense-surface-2/60 border-airsense-primary/20'
                  : 'bg-airsense-surface-2/30 border-airsense-border border-dashed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-airsense-accent' : ''}`}
                    style={isActive ? undefined : { color: 'var(--airsense-text-muted)' }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--airsense-text)' }}>
                    {m.model}
                  </span>
                </div>
                {isActive ? (
                  <span className="flex items-center gap-1 text-[10px] text-airsense-safe font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>PLANNED</span>
                )}
              </div>

              {isActive && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center bg-airsense-bg/40 rounded-md py-1.5">
                    <div className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>R²</div>
                    <div className="text-sm font-bold font-mono text-airsense-accent">
                      {m.r2.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center bg-airsense-bg/40 rounded-md py-1.5">
                    <div className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>RMSE</div>
                    <div className="text-sm font-bold font-mono text-airsense-warning">
                      {m.rmse.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-center bg-airsense-bg/40 rounded-md py-1.5">
                    <div className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>MAE</div>
                    <div className="text-sm font-bold font-mono text-airsense-primary">
                      {m.mae.toFixed(1)}
                    </div>
                  </div>
                </div>
              )}

              {!isActive && (
                <p className="text-xs mt-1" style={{ color: 'var(--airsense-text-muted)' }}>
                  Deep learning model for spatiotemporal AQI prediction. Next phase implementation.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
