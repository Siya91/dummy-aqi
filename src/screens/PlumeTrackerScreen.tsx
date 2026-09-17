import { useState, useEffect, useCallback } from 'react';
import { Wind, Layers, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import type { Plume, BiomassHotspot } from '@/types';
import { fetchPlumes, fetchBiomassHotspots } from '@/lib/api';
import BaseMap from '@/components/map/BaseMap';
import PlumeLayer from '@/components/map/PlumeLayer';
import PlumeList from '@/components/PlumeList';
import { SkeletonCard } from '@/components/LoadingSkeleton';

export default function PlumeTrackerScreen() {
  const [plumes, setPlumes] = useState<Plume[]>([]);
  const [hotspots, setHotspots] = useState<BiomassHotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHcho, setShowHcho] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedPlumeId, setSelectedPlumeId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [plumeData, hotspotData] = await Promise.all([
      fetchPlumes(),
      fetchBiomassHotspots(),
    ]);
    setPlumes(plumeData);
    setHotspots(hotspotData);
    if (plumeData.length > 0) setSelectedPlumeId(plumeData[0].id);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const transboundaryCount = plumes.filter((p) => p.transboundary).length;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--airsense-text)' }}>
            <Wind className="w-5 h-5 text-airsense-primary" />
            Plume Tracker — Module 2
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--airsense-text-muted)' }}>
            HCHO concentration tracking & biomass burning detection via satellite
          </p>
        </div>

        {/* Layer toggles */}
        <div className="flex items-center gap-2">
          <div className="glass-panel rounded-lg p-1 flex items-center gap-1">
            <button
              onClick={() => setShowHcho(!showHcho)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                showHcho
                  ? 'bg-airsense-warning/20 text-airsense-warning border border-airsense-warning/30'
                  : 'hover:text-white border border-transparent'
              }`}
              style={showHcho ? undefined : { color: 'var(--airsense-text-muted)' }}
            >
              {showHcho ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              HCHO Plumes
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                showHotspots
                  ? 'bg-airsense-danger/20 text-airsense-danger border border-airsense-danger/30'
                  : 'hover:text-white border border-transparent'
              }`}
              style={showHotspots ? undefined : { color: 'var(--airsense-text-muted)' }}
            >
              {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Biomass Hotspots
            </button>
          </div>
        </div>
      </div>

      {/* Transboundary banner */}
      {transboundaryCount > 0 && !loading && (
        <div className="glass-panel rounded-xl p-3 flex items-center gap-3 border-airsense-danger/30 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-airsense-danger/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-airsense-danger" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--airsense-text)' }}>
              <span className="font-bold text-airsense-danger">{transboundaryCount}</span>{' '}
              transboundary plume{transboundaryCount > 1 ? 's' : ''} detected
            </p>
            <p className="text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
              Pollution originating from outside Nagpur's monitoring zone
            </p>
          </div>
        </div>
      )}

      {/* Main: map + plume list */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Map */}
        <div className="glass-panel rounded-xl overflow-hidden relative" style={{ height: 'calc(100vh - 280px)', minHeight: '480px' }}>
          {loading ? (
            <div className="w-full h-full skeleton-shimmer rounded-xl" />
          ) : (
            <>
              <BaseMap>
                <PlumeLayer
                  plumes={plumes}
                  hotspots={hotspots}
                  showHcho={showHcho}
                  showHotspots={showHotspots}
                />
              </BaseMap>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 z-[500] glass-panel rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-3 h-3 text-airsense-accent" />
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--airsense-text-muted)' }}>
                    Layers
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-airsense-warning" style={{ borderTop: '2px dashed #ffaa00' }} />
                    <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Local Plume</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-airsense-danger" style={{ borderTop: '2px dashed #ff4444' }} />
                    <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Transboundary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-airsense-danger" />
                    <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Biomass Hotspot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-airsense-accent" />
                    <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Wind Direction</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Side panel: plume list */}
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <PlumeList
              plumes={plumes}
              selectedId={selectedPlumeId}
              onSelect={setSelectedPlumeId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
