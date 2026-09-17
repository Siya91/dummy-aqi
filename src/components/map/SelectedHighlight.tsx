import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { CircleMarker } from 'react-leaflet';
import { L } from '@/lib/leafletSetup';

interface SelectedHighlightProps {
  lat: number;
  lng: number;
  color: string;
}

// Pulsing ring + fly-to for the selected location
export default function SelectedHighlight({ lat, lng, color }: SelectedHighlightProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.8 });
  }, [lat, lng, map]);

  return (
    <>
      {/* Outer pulsing ring */}
      <CircleMarker
        center={[lat, lng]}
        radius={20}
        pathOptions={{
          color,
          weight: 2,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: 0.05,
          dashArray: '4 4',
        }}
      />
      {/* Inner steady ring */}
      <CircleMarker
        center={[lat, lng]}
        radius={12}
        pathOptions={{
          color,
          weight: 3,
          opacity: 0.9,
          fillColor: color,
          fillOpacity: 0.1,
        }}
      />
    </>
  );
}

export { L };
