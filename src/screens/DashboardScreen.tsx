import { useState, useEffect, useCallback } from 'react';
import { Flame, Eye, EyeOff, Satellite, Radio } from 'lucide-react';
import type { Station, HeatPoint, PredictedArea, FactorBreakdown } from '@/types';
import { fetchStations, fetchHeatmapGrid, fetchOverallAqi, fetchPredictedAreas, getExplanation } from '@/lib/api';
import { aqiToColor } from '@/lib/aqiUtils';
import BaseMap from '@/components/map/BaseMap';
import StationMarkers from '@/components/map/StationMarkers';
import PredictedAreaMarkers from '@/components/map/PredictedAreaMarkers';
import HeatmapLayer from '@/components/map/HeatmapLayer';
import SelectedHighlight from '@/components/map/SelectedHighlight';
import KpiStrip from '@/components/KpiStrip';
import StationCard from '@/components/StationCard';
import PredictedAreaCard from '@/components/PredictedAreaCard';
import FactorBreakdownCard from '@/components/FactorBreakdownCard';
import StationSelector from '@/components/StationSelector';
import TrendChart from '@/components/TrendChart';
import { SkeletonCard, SkeletonKpi, SkeletonChart } from '@/components/LoadingSkeleton';

interface DashboardScreenProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function DashboardScreen({
  selectedId,
  onSelect,
}: DashboardScreenProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [predictedAreas, setPredictedAreas] = useState<PredictedArea[]>([]);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);
  const [overall, setOverall] = useState<{ aqi: number; pm25: number; lastUpdated: string } | null>(null);
  const [factors, setFactors] = useState<FactorBreakdown[]>([]);
  const [factorsLoading, setFactorsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [stationData, heatData, overallData, areaData] = await Promise.all([
      fetchStations(),
      fetchHeatmapGrid(),
      fetchOverallAqi(),
      fetchPredictedAreas(),
    ]);
    setStations(stationData);
    setHeatPoints(heatData);
    setOverall(overallData);
    setPredictedAreas(areaData);
    if (!selectedId && stationData.length > 0) {
      onSelect(stationData[0].station_id);
    }
    setLoading(false);
  }, [selectedId, onSelect]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch factor breakdown when selection changes
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setFactorsLoading(true);
    (async () => {
      const data = await getExplanation(selectedId);
      if (!cancelled) {
        setFactors(data);
        setFactorsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId]);

  const selectedStation = stations.find((s) => s.station_id === selectedId) ?? null;
  const selectedArea = predictedAreas.find((a) => a.area_id === selectedId) ?? null;
  const isPredicted = !!selectedArea && !selectedStation;

  // Coordinates and color for the highlight ring
  const highlightLat = selectedStation?.lat ?? selectedArea?.lat ?? null;
  const highlightLng = selectedStation?.lng ?? selectedArea?.lng ?? null;
  const highlightColor = selectedStation
    ? aqiToColor(selectedStation.aqi)
    : selectedArea
    ? aqiToColor(selectedArea.aqi)
    : '#1e90ff';

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* KPI strip + station selector */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--airsense-text)' }}>
            <Flame className="w-5 h-5 text-airsense-primary" />
            Air Quality Dashboard
          </h2>
          {!loading && stations.length > 0 && (
            <StationSelector
              stations={stations}
              predictedAreas={predictedAreas}
              selectedId={selectedId}
              onSelect={(id) => onSelect(id || null)}
            />
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonKpi key={i} />
            ))}
          </div>
        ) : (
          overall && (
            <KpiStrip
              overallAqi={overall.aqi}
              overallPm25={overall.pm25}
              activeStations={stations.length}
              lastUpdated={overall.lastUpdated}
              stations={stations}
            />
          )
        )}
      </div>

      {/* Main content: map + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Map */}
        <div className="glass-panel rounded-xl overflow-hidden relative" style={{ height: 'calc(100vh - 280px)', minHeight: '480px' }}>
          {loading ? (
            <div className="w-full h-full skeleton-shimmer rounded-xl" />
          ) : (
            <>
              <BaseMap>
                <HeatmapLayer points={heatPoints} visible={showHeatmap} />
                <StationMarkers
                  stations={stations}
                  selectedId={selectedId}
                  onSelect={(id) => onSelect(id)}
                />
                <PredictedAreaMarkers
                  areas={predictedAreas}
                  selectedId={selectedId}
                  onSelect={(id) => onSelect(id)}
                />
                {highlightLat !== null && highlightLng !== null && (
                  <SelectedHighlight
                    lat={highlightLat}
                    lng={highlightLng}
                    color={highlightColor}
                  />
                )}
              </BaseMap>

              {/* Heatmap toggle — prominent */}
              <div className="absolute top-4 right-4 z-[500] glass-panel rounded-lg p-2 flex items-center gap-2">
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

        {/* Side panel */}
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonChart height={200} />
            </>
          ) : selectedStation ? (
            <>
              <StationCard station={selectedStation} />
              <div className="glass-panel rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--airsense-text)' }}>
                  <span className="w-1 h-4 rounded-full bg-airsense-accent" />
                  24h PM2.5 Trend
                </h3>
                <TrendChart data={selectedStation.trend} height={200} />
              </div>
              <FactorBreakdownCard factors={factors} isPredicted={false} loading={factorsLoading} />
            </>
          ) : selectedArea ? (
            <>
              <PredictedAreaCard area={selectedArea} />
              <div className="glass-panel rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--airsense-text)' }}>
                  <span className="w-1 h-4 rounded-full bg-airsense-accent" />
                  24h PM2.5 Trend (Predicted)
                </h3>
                <TrendChart data={selectedArea.trend} height={200} />
              </div>
              <FactorBreakdownCard factors={factors} isPredicted={true} loading={factorsLoading} />
            </>
          ) : (
            <>
              <SkeletonCard />
              <SkeletonChart height={200} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
