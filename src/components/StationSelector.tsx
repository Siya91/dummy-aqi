import { ChevronDown, MapPin } from 'lucide-react';
import type { Station, PredictedArea } from '@/types';
import { aqiToColor } from '@/lib/aqiUtils';

interface StationSelectorProps {
  stations: Station[];
  predictedAreas: PredictedArea[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function StationSelector({
  stations,
  predictedAreas,
  selectedId,
  onSelect,
}: StationSelectorProps) {
  const selectedStation = stations.find((s) => s.station_id === selectedId);
  const selectedArea = predictedAreas.find((a) => a.area_id === selectedId);
  const selectedColor = selectedStation
    ? aqiToColor(selectedStation.aqi)
    : selectedArea
    ? aqiToColor(selectedArea.aqi)
    : null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-airsense-surface border border-airsense-border hover:border-airsense-primary/40 transition-colors">
        <MapPin className="w-4 h-4 text-airsense-accent flex-shrink-0" />
        <select
          value={selectedId ?? ''}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-transparent text-sm outline-none cursor-pointer appearance-none pr-6 min-w-[160px]"
          style={{ color: 'var(--airsense-text)' }}
        >
          <option value="" className="bg-airsense-surface" style={{ color: 'var(--airsense-text)' }}>
            All locations
          </option>
          <optgroup label="Live CPCB Stations" className="bg-airsense-surface font-semibold" style={{ color: 'var(--airsense-text-muted)' }}>
            {stations.map((s) => (
              <option
                key={s.station_id}
                value={s.station_id}
                className="bg-airsense-surface"
                style={{ color: 'var(--airsense-text)' }}
              >
                {s.name}
              </option>
            ))}
          </optgroup>
          {predictedAreas.length > 0 && (
            <optgroup label="Predicted (Satellite)" className="bg-airsense-surface font-semibold" style={{ color: 'var(--airsense-text-muted)' }}>
              {predictedAreas.map((a) => (
                <option
                  key={a.area_id}
                  value={a.area_id}
                  className="bg-airsense-surface"
                  style={{ color: 'var(--airsense-text)' }}
                >
                  {a.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2" style={{ color: 'var(--airsense-text-muted)' }} />
      </div>
      {selectedColor && (
        <div
          className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full transition-colors"
          style={{ background: selectedColor }}
        />
      )}
    </div>
  );
}
