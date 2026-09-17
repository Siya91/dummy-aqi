import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, Brain } from 'lucide-react';
import type { Station, ForecastPoint, ModelMetrics, PredictedArea } from '@/types';
import { fetchStations, fetchForecast, fetchModelMetrics, fetchPredictedAreas } from '@/lib/api';
import StationSelector from '@/components/StationSelector';
import PredictionChart from '@/components/PredictionChart';
import ModelInfoCard from '@/components/ModelInfoCard';
import { SkeletonChart, SkeletonCard } from '@/components/LoadingSkeleton';

interface PredictionsScreenProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function PredictionsScreen({
  selectedId,
  onSelect,
}: PredictionsScreenProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [predictedAreas, setPredictedAreas] = useState<PredictedArea[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [models, setModels] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [stationData, areaData, modelData] = await Promise.all([
      fetchStations(),
      fetchPredictedAreas(),
      fetchModelMetrics(),
    ]);
    setStations(stationData);
    setPredictedAreas(areaData);
    setModels(modelData);
    if (!selectedId && stationData.length > 0) {
      onSelect(stationData[0].station_id);
    }
    const id = selectedId ?? stationData[0]?.station_id;
    if (id) {
      const forecastData = await fetchForecast(id);
      setForecast(forecastData);
    }
    setLoading(false);
  }, [selectedId, onSelect]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload forecast when selection changes
  useEffect(() => {
    if (!selectedId || loading) return;
    let cancelled = false;
    (async () => {
      const data = await fetchForecast(selectedId);
      if (!cancelled) setForecast(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selectedStation = stations.find((s) => s.station_id === selectedId);
  const selectedArea = predictedAreas.find((a) => a.area_id === selectedId);
  const selectedName = selectedStation?.name ?? selectedArea?.name ?? 'Select Location';
  const isPredicted = !!selectedArea && !selectedStation;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--airsense-text)' }}>
          <TrendingUp className="w-5 h-5 text-airsense-primary" />
          7-Day AQI Forecast
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Chart */}
        <div className="glass-panel rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-airsense-accent" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
                {selectedName} — Forecast
              </h3>
              {isPredicted && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-airsense-accent/10 text-airsense-accent border border-airsense-accent/20">
                  SATELLITE MODEL
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-airsense-safe" />
                <span style={{ color: 'var(--airsense-text-muted)' }}>Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t-2 border-dashed border-airsense-primary" />
                <span style={{ color: 'var(--airsense-text-muted)' }}>Predicted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2 bg-airsense-primary/15 rounded-sm" />
                <span style={{ color: 'var(--airsense-text-muted)' }}>Confidence</span>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonChart height={320} />
          ) : (
            <PredictionChart data={forecast} height={320} />
          )}

          {/* Summary stats */}
          {!loading && forecast.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-airsense-border">
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--airsense-text-muted)' }}>
                  Predicted Peak
                </div>
                <div className="text-xl font-bold font-mono text-airsense-danger">
                  {Math.max(...forecast.map((f) => f.predicted))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--airsense-text-muted)' }}>
                  Predicted Low
                </div>
                <div className="text-xl font-bold font-mono text-airsense-safe">
                  {Math.min(...forecast.map((f) => f.predicted))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--airsense-text-muted)' }}>
                  Avg Confidence
                </div>
                <div className="text-xl font-bold font-mono text-airsense-accent">
                  ±{Math.round(
                    forecast
                      .filter((f) => f.actual === null)
                      .reduce((s, f) => s + (f.confidenceHigh - f.confidenceLow), 0) /
                      Math.max(1, forecast.filter((f) => f.actual === null).length)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel: model info */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <SkeletonCard />
          ) : (
            <ModelInfoCard models={models} />
          )}

          {/* Info card */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-airsense-accent" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>About Predictions</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
              Forecasts use satellite-derived PM2.5 estimates combined with
              ground station data. The Random Forest baseline integrates
              meteorological features, temporal patterns, and spatial
              interpolation. The CNN-LSTM model will capture complex
              spatiotemporal dynamics for improved accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
