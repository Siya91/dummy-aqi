export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-6 w-12" />
      </div>
      <SkeletonBlock className="h-2 w-full" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-16 w-full" />
        <SkeletonBlock className="h-16 w-full" />
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <SkeletonBlock className="h-4 w-32 mb-4" />
      <SkeletonBlock className="w-full" />
      <div style={{ height }} />
    </div>
  );
}

export function SkeletonKpi() {
  return (
    <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
      <SkeletonBlock className="w-10 h-10 rounded-lg flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-6 w-16" />
      </div>
    </div>
  );
}
