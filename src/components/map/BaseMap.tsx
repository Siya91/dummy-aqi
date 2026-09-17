import { MapContainer, TileLayer } from 'react-leaflet';
import type { ReactNode } from 'react';

// Nagpur center coordinates
export const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];
export const NAGPUR_ZOOM = 11;

interface BaseMapProps {
  children?: ReactNode;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

export default function BaseMap({
  children,
  className = 'h-full w-full',
  center = NAGPUR_CENTER,
  zoom = NAGPUR_ZOOM,
}: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      scrollWheelZoom
      zoomControl
      attributionControl
    >
      {/* Free OpenStreetMap tiles — dark theme applied via CSS filter on .leaflet-tile-pane */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        subdomains="abc"
        maxZoom={19}
      />
      {children}
    </MapContainer>
  );
}
