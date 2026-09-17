import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { HeatPoint } from '@/types';
import { L } from '@/lib/leafletSetup';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: HeatPoint[];
  visible: boolean;
}

// Find max pm25 for normalization
function getMaxPm25(points: HeatPoint[]): number {
  return points.reduce((max, p) => Math.max(max, p.pm25), 0);
}

export default function HeatmapLayer({ points, visible }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible || points.length === 0) return;

    const max = getMaxPm25(points);
    const heatData: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lng,
      p.pm25 / max,
    ]);

    const heatLayer = (L as unknown as {
      heatLayer: (
        data: [number, number, number][],
        opts: Record<string, unknown>
      ) => { addTo: (m: typeof map) => void; remove: () => void };
    }).heatLayer(heatData, {
      radius: 35,
      blur: 25,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: '#00cc66',
        0.3: '#ffaa00',
        0.5: '#ff8844',
        0.7: '#ff4444',
        1.0: '#aa00ff',
      },
    });

    heatLayer.addTo(map);

    return () => {
      heatLayer.remove();
    };
  }, [points, visible, map]);

  return null;
}
