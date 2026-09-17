import { Brain, Info } from 'lucide-react';
import type { FactorBreakdown } from '@/types';

interface FactorBreakdownCardProps {
  factors: FactorBreakdown[];
  isPredicted: boolean;
  loading?: boolean;
}

export default function FactorBreakdownCard({
  factors,
  isPredicted,
  loading = false,
}: FactorBreakdownCardProps) {
  return (
    <div className="glass-panel rounded-xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="w-4 h-4 text-airsense-accent" />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
          Why this value?
        </h3>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-airsense-primary/10 text-airsense-primary border border-airsense-primary/20">
          Model factor breakdown
        </span>
      </div>

      {isPredicted && (
        <div className="flex items-start gap-1.5 mt-2 mb-3 px-2 py-1.5 rounded-md bg-airsense-warning/10 border border-airsense-warning/20">
          <Info className="w-3 h-3 text-airsense-warning flex-shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            Confidence reflects distance from nearest CPCB station and satellite data quality.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3 mt-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-8 skeleton-shimmer rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 mt-3">
          {factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--airsense-text)' }}>
                  {factor.label}
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: factor.color }}>
                  {factor.percentage}%
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--airsense-surface-2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${factor.percentage}%`,
                    background: factor.color,
                  }}
                />
              </div>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
