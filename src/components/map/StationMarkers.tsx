import { Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { Station } from '@/types';
import { createStationIcon } from '@/lib/leafletSetup';
import { aqiToColor } from '@/lib/aqiUtils';
import { formatTimestamp } from '@/lib/aqiUtils';

interface StationMarkersProps {
  stations: Station[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function FlyToSelected({
  stations,
  selectedId,
}: {
  stations: Station[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const s = stations.find((st) => st.station_id === selectedId);
    if (s) {
      map.flyTo([s.lat, s.lng], 13, { duration: 0.8 });
    }
  }, [selectedId, stations, map]);
  return null;
}

export default function StationMarkers({
  stations,
  selectedId,
  onSelect,
}: StationMarkersProps) {
  return (
    <>
      <FlyToSelected stations={stations} selectedId={selectedId} />
      {stations.map((s) => {
        const color = aqiToColor(s.aqi);
        const isSelected = s.station_id === selectedId;
        return (
          <Marker
            key={s.station_id}
            position={[s.lat, s.lng]}
            icon={createStationIcon(color, isSelected)}
            eventHandlers={{
              click: () => onSelect(s.station_id),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="font-semibold text-sm" style={{ color: 'var(--airsense-text)' }}>
                    {s.name}
                  </span>
                </div>
                <div className="space-y-1 text-xs" style={{ color: 'var(--airsense-text)' }}>
                  <div className="flex justify-between">
                    <span>AQI</span>
                    <span className="font-mono font-bold" style={{ color }}>
                      {s.aqi}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PM2.5</span>
                    <span className="font-mono">{s.pm25} µg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-right" style={{ color }}>
                      {s.category}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-700 mt-1">
                    <span>Updated</span>
                    <span className="font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                      {formatTimestamp(s.timestamp)}
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
