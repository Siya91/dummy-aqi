// ── Leaflet default marker icon fix ─────────────────────────────
// react-leaflet has a known bug where default marker icons don't show
// because the bundler can't resolve the relative asset paths. We
// manually set the icon URLs from the CDN to fix this.

import L from 'leaflet';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function createStationIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 22 : 16;
  const ringSize = isSelected ? 34 : 26;
  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="position:relative;width:${ringSize}px;height:${ringSize}px;display:flex;align-items:center;justify-content:center;">
        <div class="station-marker-pulse" style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};opacity:0.3;"></div>
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid var(--marker-border);box-shadow:0 0 ${isSelected ? '12px' : '6px'} ${color}55;display:flex;align-items:center;justify-content:center;">
          <div style="width:${size * 0.4}px;height:${size * 0.4}px;border-radius:50%;background:var(--marker-border);"></div>
        </div>
      </div>
    `,
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -ringSize / 2],
  });
}

export function createPredictedAreaIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 20 : 14;
  const ringSize = isSelected ? 30 : 22;
  return L.divIcon({
    className: 'custom-predicted-marker',
    html: `
      <div style="position:relative;width:${ringSize}px;height:${ringSize}px;display:flex;align-items:center;justify-content:center;">
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:${color}33;border:2px dashed ${color};display:flex;align-items:center;justify-content:center;">
          <div style="width:${size * 0.35}px;height:${size * 0.35}px;border-radius:50%;background:${color};opacity:0.7;"></div>
        </div>
      </div>
    `,
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -ringSize / 2],
  });
}

export function createHotspotIcon(intensity: number): L.DivIcon {
  const size = 14 + intensity * 10;
  return L.divIcon({
    className: 'custom-hotspot-marker',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        <div class="station-marker-pulse" style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:#ff4444;opacity:0.4;"></div>
        <div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:#ff444499;border:2px solid #ff4444;box-shadow:0 0 8px #ff444466;"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export { L };
