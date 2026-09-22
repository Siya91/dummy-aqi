import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Satellite, Radio } from 'lucide-react';
import type { Station, HeatPoint, PredictedArea } from '@/types';
import { fetchStations, fetchHeatmapGrid, fetchPredictedAreas } from '@/lib/api';
import { aqiToColor } from '@/lib/aqiUtils';
import BaseMap from '@/components/map/BaseMap';
import StationMarkers from '@/components/map/StationMarkers';
import PredictedAreaMarkers from '@/components/map/PredictedAreaMarkers';
import HeatmapLayer from '@/components/map/HeatmapLayer';

export default function LiveAqiMapSection() {
  const [stations, setStations] = useState<Station[]>([]);
  const [predictedAreas, setPredictedAreas] = useState<PredictedArea[]>([]);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [stationData, heatData, areaData] = await Promise.all([
      fetchStations(),
      fetchHeatmapGrid(),
      fetchPredictedAreas(),
    ]);
    setStations(stationData);
    setHeatPoints(heatData);
    setPredictedAreas(areaData);
    if (stationData.length > 0) setSelectedId(stationData[0].station_id);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" style={{ color: 'var(--airsense-text-muted)' }}>
          Real-time air quality map of Nagpur with CPCB stations and satellite-predicted grid points.
        </p>
        <div className="glass-panel rounded-lg p-1 flex items-center gap-1">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              showHeatmap
                ? 'bg-airsense-primary/20 text-airsense-accent border border-airsense-primary/30'
                : 'border border-transparent hover:bg-airsense-primary/10'
            }`}
            style={{ color: showHeatmap ? undefined : 'var(--airsense-text-muted)' }}
          >
            {showHeatmap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Prediction Heatmap
          </button>
        </div>
      </div>

      {/* Map */}
      <div
        className="glass-panel rounded-xl overflow-hidden relative"
        style={{ height: '60vh', minHeight: '400px' }}
      >
        {loading ? (
          <div className="w-full h-full skeleton-shimmer rounded-xl" />
        ) : (
          <>
            <BaseMap>
              <HeatmapLayer points={heatPoints} visible={showHeatmap} />
              <StationMarkers
                stations={stations}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
              />
              <PredictedAreaMarkers
                areas={predictedAreas}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
              />
            </BaseMap>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[500] glass-panel rounded-lg p-3">
              <div className="text-[10px] font-mono mb-2 uppercase tracking-wider" style={{ color: 'var(--airsense-text-muted)' }}>
                Map Legend
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-airsense-safe" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Live CPCB Station</span>
                </div>
                <div className="flex items-center gap-2">
                  <Satellite className="w-3 h-3 text-airsense-accent" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>Predicted (Satellite)</span>
                </div>
                <div className="flex items-center gap-2 mt-1 pt-1" style={{ borderTop: '1px solid var(--airsense-border)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-aqi-good" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>0-50 Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-aqi-moderate" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>51-100 Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-aqi-unhealthy" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>101-150 USG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-aqi-bad" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>151-200 Unhealthy</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
