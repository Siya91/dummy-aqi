import { Polyline, Marker, Popup, Tooltip, Circle } from 'react-leaflet';
import type { Plume, BiomassHotspot } from '@/types';
import { createHotspotIcon } from '@/lib/leafletSetup';
import { formatTimestamp } from '@/lib/aqiUtils';

interface PlumeLayerProps {
  plumes: Plume[];
  hotspots: BiomassHotspot[];
  showHcho: boolean;
  showHotspots: boolean;
}

export default function PlumeLayer({
  plumes,
  hotspots,
  showHcho,
  showHotspots,
}: PlumeLayerProps) {
  return (
    <>
      {/* Plume trajectories */}
      {showHcho &&
        plumes.map((plume) => (
          <Polyline
            key={plume.id}
            positions={plume.trajectory}
            pathOptions={{
              color: plume.transboundary ? '#ff4444' : '#ffaa00',
              weight: 3,
              opacity: 0.7,
              dashArray: '8 6',
            }}
          >
            <Tooltip sticky>
              <div className="text-xs">
                <div className="font-semibold">{plume.name}</div>
                <div>HCHO: {(plume.hchoConcentration * 1e4).toFixed(2)} ×10⁻⁴ mol/m²</div>
                <div>Confidence: {(plume.confidence * 100).toFixed(0)}%</div>
                {plume.transboundary && (
                  <div className="text-red-400 font-semibold mt-1">
                    ⚠ Transboundary
                  </div>
                )}
              </div>
            </Tooltip>
          </Polyline>
        ))}

      {/* Wind direction arrows at plume sources */}
      {showHcho &&
        plumes.map((plume) => {
          const arrowEnd: [number, number] = [
            plume.sourceLat + 0.008 * Math.cos((plume.windDirection * Math.PI) / 180),
            plume.sourceLng + 0.008 * Math.sin((plume.windDirection * Math.PI) / 180),
          ];
          return (
            <Polyline
              key={`wind-${plume.id}`}
              positions={[[plume.sourceLat, plume.sourceLng], arrowEnd]}
              pathOptions={{
                color: '#00d4ff',
                weight: 2,
                opacity: 0.6,
              }}
            />
          );
        })}

      {/* Biomass burning hotspots */}
      {showHotspots &&
        hotspots.map((hs, idx) => (
          <Marker
            key={`hotspot-${idx}`}
            position={[hs.lat, hs.lng]}
            icon={createHotspotIcon(hs.intensity)}
          >
            <Popup>
              <div className="min-w-[160px] p-1">
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--airsense-text)' }}>
                  Biomass Burning Hotspot
                </div>
                <div className="text-xs space-y-1" style={{ color: 'var(--airsense-text)' }}>
                  <div className="flex justify-between">
                    <span>Intensity</span>
                    <span className="font-mono text-red-400">
                      {(hs.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Radius</span>
                    <span className="font-mono">{hs.radius}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detected</span>
                    <span className="font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                      {formatTimestamp(hs.detectedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Transboundary zone circles */}
      {showHcho &&
        plumes
          .filter((p) => p.transboundary)
          .map((plume) => (
            <Circle
              key={`zone-${plume.id}`}
              center={[plume.trajectory[plume.trajectory.length - 1][0], plume.trajectory[plume.trajectory.length - 1][1]]}
              radius={1500}
              pathOptions={{
                color: '#ff4444',
                fillColor: '#ff4444',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '4 4',
              }}
            />
          ))}
    </>
  );
}
