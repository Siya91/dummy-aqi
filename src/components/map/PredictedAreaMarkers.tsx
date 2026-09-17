import { Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { PredictedArea } from '@/types';
import { createPredictedAreaIcon } from '@/lib/leafletSetup';
import { aqiToColor, formatTimestamp } from '@/lib/aqiUtils';

interface PredictedAreaMarkersProps {
  areas: PredictedArea[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function FlyToSelected({
  areas,
  selectedId,
}: {
  areas: PredictedArea[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const a = areas.find((ar) => ar.area_id === selectedId);
    if (a) {
      map.flyTo([a.lat, a.lng], 12, { duration: 0.8 });
    }
  }, [selectedId, areas, map]);
  return null;
}

export default function PredictedAreaMarkers({
  areas,
  selectedId,
  onSelect,
}: PredictedAreaMarkersProps) {
  return (
    <>
      <FlyToSelected areas={areas} selectedId={selectedId} />
      {areas.map((a) => {
        const color = aqiToColor(a.aqi);
        const isSelected = a.area_id === selectedId;
        return (
          <Marker
            key={a.area_id}
            position={[a.lat, a.lng]}
            icon={createPredictedAreaIcon(color, isSelected)}
            eventHandlers={{
              click: () => onSelect(a.area_id),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-dashed"
                    style={{ borderColor: color, background: `${color}33` }}
                  />
                  <span className="font-semibold text-sm" style={{ color: 'var(--airsense-text)' }}>
                    {a.name}
                  </span>
                </div>
                <div className="px-2 py-1 mb-2 rounded bg-airsense-accent/10 border border-airsense-accent/20">
                  <p className="text-[10px] text-airsense-accent">
                    Predicted (Satellite Model)
                  </p>
                </div>
                <div className="space-y-1 text-xs" style={{ color: 'var(--airsense-text)' }}>
                  <div className="flex justify-between">
                    <span>AQI</span>
                    <span className="font-mono font-bold" style={{ color }}>
                      {a.aqi}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PM2.5</span>
                    <span className="font-mono">{a.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence</span>
                    <span className="font-mono text-airsense-accent">
                      {(a.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-right" style={{ color }}>
                      {a.category}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-700 mt-1">
                    <span>Updated</span>
                    <span className="font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                      {formatTimestamp(a.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
