// ── AirSense Nagpur — Mock API Layer ────────────────────────────
// All data fetching is isolated here. Swap these mock functions for
// real FastAPI calls later — the component layer stays unchanged.
//
// Expected real endpoints:
//   GET /api/stations          → Station[]
//   GET /api/stations/:id      → Station
//   GET /api/forecast/:id      → ForecastPoint[]
//   GET /api/models            → ModelMetrics[]
//   GET /api/plumes            → Plume[]
//   GET /api/biomass-hotspots  → BiomassHotspot[]
//   GET /api/heatmap-grid      → HeatPoint[]
//   GET /api/predicted-areas  → PredictedArea[]
//   GET /api/predicted-areas/:id → PredictedArea
//   GET /api/explanation/:id    → FactorBreakdown[]

import type {
  Station,
  ForecastPoint,
  ModelMetrics,
  Plume,
  BiomassHotspot,
  HeatPoint,
  PredictedArea,
  AqiCategory,
  FactorBreakdown,
} from '@/types';
import { aqiToCategory } from '@/lib/aqiUtils';

// ── Helpers ─────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base: number, range: number): number {
  return +(base + (Math.random() - 0.5) * range).toFixed(1);
}

function gen24hTrend(basePm25: number): { time: string; pm25: number }[] {
  const points: { time: string; pm25: number }[] = [];
  for (let h = 23; h >= 0; h--) {
    const d = new Date();
    d.setHours(d.getHours() - h);
    const label = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    // Simulate diurnal pattern: peaks at morning/evening rush
    const hour = d.getHours();
    const diurnal =
      1.3 * Math.exp(-Math.pow(hour - 8, 2) / 8) +
      1.2 * Math.exp(-Math.pow(hour - 19, 2) / 6);
    const pm25 = Math.max(5, jitter(basePm25 * (0.6 + diurnal * 0.5), basePm25 * 0.3));
    points.push({ time: label, pm25 });
  }
  return points;
}

function pm25ToAqi(pm25: number): number {
  // Simplified PM2.5 → AQI conversion (EPA breakpoints)
  const breakpoints = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500, 301, 500],
  ] as const;
  for (const [pmLo, pmHi, aqiLo, aqiHi] of breakpoints) {
    if (pm25 >= pmLo && pm25 <= pmHi) {
      return Math.round(((aqiHi - aqiLo) / (pmHi - pmLo)) * (pm25 - pmLo) + aqiLo);
    }
  }
  return 500;
}

// ── Station data ────────────────────────────────────────────────

const STATION_DEFS = [
  { station_id: 'CL-01', name: 'Civil Lines', lat: 21.1533, lng: 79.0843, basePm25: 48 },
  { station_id: 'RN-02', name: 'Ram Nagar', lat: 21.1434, lng: 79.0489, basePm25: 72 },
  { station_id: 'MH-03', name: 'Mahal', lat: 21.1447, lng: 79.1076, basePm25: 95 },
  { station_id: 'AZ-04', name: 'Ambazari', lat: 21.1218, lng: 79.0495, basePm25: 35 },
];

// Predicted areas — locations with no CPCB station, estimated from satellite fusion model
const PREDICTED_AREA_DEFS = [
  { area_id: 'PA-KAL', name: 'Kalmeshwar', lat: 21.2367, lng: 78.8769, basePm25: 62 },
  { area_id: 'PA-HIN', name: 'Hingna', lat: 21.1639, lng: 78.9347, basePm25: 78 },
  { area_id: 'PA-KMP', name: 'Kamptee', lat: 21.2236, lng: 79.1903, basePm25: 85 },
  { area_id: 'PA-MAU', name: 'Mauda', lat: 21.1833, lng: 79.1500, basePm25: 58 },
  { area_id: 'PA-WAD', name: 'Wadi', lat: 21.1700, lng: 78.9700, basePm25: 70 },
  { area_id: 'PA-GOD', name: 'Godhani', lat: 21.2450, lng: 78.9500, basePm25: 55 },
  { area_id: 'PA-SAV', name: 'Savner', lat: 21.2700, lng: 78.9000, basePm25: 50 },
  { area_id: 'PA-DRG', name: 'Dr. Ambedkar Nagar', lat: 21.1300, lng: 79.1500, basePm25: 88 },
  { area_id: 'PA-KTH', name: 'Kothrud (Outer)', lat: 21.1550, lng: 79.0200, basePm25: 65 },
  { area_id: 'PA-BHI', name: 'Bhiwapar', lat: 21.0900, lng: 79.0300, basePm25: 72 },
];

export async function fetchStations(): Promise<Station[]> {
  await delay(600);
  return STATION_DEFS.map((s) => {
    const pm25 = jitter(s.basePm25, s.basePm25 * 0.2);
    const aqi = pm25ToAqi(pm25);
    const category: AqiCategory = aqiToCategory(aqi);
    return {
      station_id: s.station_id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      pm25,
      aqi,
      category,
      timestamp: new Date().toISOString(),
      trend: gen24hTrend(s.basePm25),
    };
  });
}

export async function fetchStation(id: string): Promise<Station | null> {
  await delay(300);
  const stations = await fetchStations();
  return stations.find((s) => s.station_id === id) ?? null;
}

// ── Predicted area data (satellite fusion model, no CPCB station) ─

export async function fetchPredictedAreas(): Promise<PredictedArea[]> {
  await delay(500);
  return PREDICTED_AREA_DEFS.map((a) => {
    const pm25 = jitter(a.basePm25, a.basePm25 * 0.25);
    const aqi = pm25ToAqi(pm25);
    const category: AqiCategory = aqiToCategory(aqi);
    return {
      area_id: a.area_id,
      name: a.name,
      lat: a.lat,
      lng: a.lng,
      pm25,
      aqi,
      category,
      confidence: 0.65 + Math.random() * 0.2,
      timestamp: new Date().toISOString(),
      trend: gen24hTrend(a.basePm25),
    };
  });
}

export async function fetchPredictedArea(id: string): Promise<PredictedArea | null> {
  await delay(300);
  const areas = await fetchPredictedAreas();
  return areas.find((a) => a.area_id === id) ?? null;
}

// ── Forecast data ───────────────────────────────────────────────

export async function fetchForecast(stationId: string): Promise<ForecastPoint[]> {
  await delay(700);
  const station = STATION_DEFS.find((s) => s.station_id === stationId) ?? STATION_DEFS[0];
  const baseAqi = pm25ToAqi(station.basePm25);
  const points: ForecastPoint[] = [];

  // 3 days of "actual" past + 7 days predicted
  for (let i = -3; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1;
    const trend = 1 + i * 0.02; // slight upward trend
    const predicted = Math.round(baseAqi * weekendDip * trend * (0.9 + Math.random() * 0.2));
    const band = Math.round(15 + i * 3); // confidence widens with time

    points.push({
      date: dateStr,
      actual: i <= 0 ? Math.round(predicted * (0.95 + Math.random() * 0.1)) : null,
      predicted,
      confidenceLow: Math.max(0, predicted - band),
      confidenceHigh: predicted + band,
    });
  }
  return points;
}

// ── Model metrics ───────────────────────────────────────────────

export async function fetchModelMetrics(): Promise<ModelMetrics[]> {
  await delay(400);
  return [
    {
      model: 'Random Forest (baseline)',
      r2: 0.82,
      rmse: 12.4,
      mae: 9.8,
      status: 'active',
    },
    {
      model: 'CNN-LSTM (next phase)',
      r2: 0.0,
      rmse: 0.0,
      mae: 0.0,
      status: 'planned',
    },
  ];
}

// ── Plume data ──────────────────────────────────────────────────

export async function fetchPlumes(): Promise<Plume[]> {
  await delay(600);
  return [
    {
      id: 'PL-001',
      sourceLat: 21.08,
      sourceLng: 78.95,
      name: 'Biomass Burning — West Nagpur',
      hchoConcentration: 8.5e-4,
      windDirection: 75,
      windSpeed: 3.2,
      confidence: 0.87,
      transboundary: false,
      detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      trajectory: [
        [21.08, 78.95],
        [21.09, 78.98],
        [21.1, 79.02],
        [21.12, 79.05],
        [21.14, 79.08],
      ],
    },
    {
      id: 'PL-002',
      sourceLat: 21.22,
      sourceLng: 79.18,
      name: 'Industrial Plume — NE Corridor',
      hchoConcentration: 6.2e-4,
      windDirection: 210,
      windSpeed: 4.5,
      confidence: 0.74,
      transboundary: true,
      detectedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      trajectory: [
        [21.22, 79.18],
        [21.2, 79.15],
        [21.18, 79.12],
        [21.16, 79.1],
        [21.145, 79.09],
      ],
    },
    {
      id: 'PL-003',
      sourceLat: 21.05,
      sourceLng: 79.12,
      name: 'Agricultural Residue — South',
      hchoConcentration: 5.1e-4,
      windDirection: 15,
      windSpeed: 2.8,
      confidence: 0.68,
      transboundary: false,
      detectedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      trajectory: [
        [21.05, 79.12],
        [21.07, 79.12],
        [21.09, 79.115],
        [21.11, 79.11],
        [21.13, 79.105],
      ],
    },
  ];
}

export async function fetchBiomassHotspots(): Promise<BiomassHotspot[]> {
  await delay(500);
  return [
    { lat: 21.08, lng: 78.95, intensity: 0.9, radius: 800, detectedAt: new Date(Date.now() - 3600000).toISOString() },
    { lat: 21.22, lng: 79.18, intensity: 0.72, radius: 600, detectedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { lat: 21.05, lng: 79.12, intensity: 0.65, radius: 500, detectedAt: new Date(Date.now() - 3 * 3600000).toISOString() },
    { lat: 21.18, lng: 79.0, intensity: 0.55, radius: 450, detectedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  ];
}

// ── Heatmap grid (interpolated predictions for unmonitored areas) ─

export async function fetchHeatmapGrid(): Promise<HeatPoint[]> {
  await delay(500);
  const points: HeatPoint[] = [];
  // Expanded grid spanning greater Nagpur (including Kalmeshwar, Hingna, Kamptee, etc.)
  const latMin = 21.05,
    latMax = 21.30;
  const lngMin = 78.85,
    lngMax = 79.22;
  const steps = 7; // 8x8 = 64 points

  // Combine stations + predicted areas as influence sources
  const allSources = [
    ...STATION_DEFS.map((s) => ({ lat: s.lat, lng: s.lng, basePm25: s.basePm25, weight: 1.0 })),
    ...PREDICTED_AREA_DEFS.map((a) => ({ lat: a.lat, lng: a.lng, basePm25: a.basePm25, weight: 0.7 })),
  ];

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const lat = latMin + ((latMax - latMin) * i) / steps;
      const lng = lngMin + ((lngMax - lngMin) * j) / steps;

      // IDW interpolation from all sources (stations + predicted areas)
      let pm25 = 0;
      let weightSum = 0;
      for (const src of allSources) {
        const dist = Math.sqrt(Math.pow(lat - src.lat, 2) + Math.pow(lng - src.lng, 2));
        const w = src.weight / (dist * dist + 0.002);
        pm25 += w * src.basePm25;
        weightSum += w;
      }
      pm25 = pm25 / (weightSum + 0.01);
      // Add noise for unmonitored prediction feel
      pm25 = jitter(pm25, 18);

      points.push({ lat, lng, pm25: Math.round(pm25 * 10) / 10 });
    }
  }
  return points;
}

// ── Current overall AQI ─────────────────────────────────────────

export async function fetchOverallAqi(): Promise<{ aqi: number; pm25: number; lastUpdated: string }> {
  await delay(300);
  const stations = await fetchStations();
  const avgPm25 = stations.reduce((sum, s) => sum + s.pm25, 0) / stations.length;
  const avgAqi = stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length;
  return {
    aqi: Math.round(avgAqi),
    pm25: Math.round(avgPm25 * 10) / 10,
    lastUpdated: new Date().toISOString(),
  };
}

// ── Factor explanation (mock SHAP-style breakdown) ──────────────
// Swap with real SHAP values from the model API later.

const STATION_FACTORS: Record<string, FactorBreakdown[]> = {
  'CL-01': [
    { label: 'NO2 (satellite)', percentage: 35, color: '#1e90ff', description: 'Tropospheric NO2 column density from Sentinel-5P' },
    { label: 'AOD (aerosol optical depth)', percentage: 28, color: '#00d4ff', description: 'Aerosol optical depth from MODIS/Aqua' },
    { label: 'Weather (ERA5)', percentage: 22, color: '#ffaa00', description: 'Temperature, humidity, wind speed from ERA5 reanalysis' },
    { label: 'Historical pattern', percentage: 15, color: '#00cc66', description: '7-day historical station data pattern' },
  ],
  'RN-02': [
    { label: 'NO2 (satellite)', percentage: 32, color: '#1e90ff', description: 'Tropospheric NO2 column density from Sentinel-5P' },
    { label: 'AOD (aerosol optical depth)', percentage: 30, color: '#00d4ff', description: 'Aerosol optical depth from MODIS/Aqua' },
    { label: 'Weather (ERA5)', percentage: 20, color: '#ffaa00', description: 'Temperature, humidity, wind speed from ERA5 reanalysis' },
    { label: 'Historical pattern', percentage: 18, color: '#00cc66', description: '7-day historical station data pattern' },
  ],
  'MH-03': [
    { label: 'NO2 (satellite)', percentage: 38, color: '#1e90ff', description: 'Tropospheric NO2 column density from Sentinel-5P' },
    { label: 'AOD (aerosol optical depth)', percentage: 25, color: '#00d4ff', description: 'Aerosol optical depth from MODIS/Aqua' },
    { label: 'Weather (ERA5)', percentage: 24, color: '#ffaa00', description: 'Temperature, humidity, wind speed from ERA5 reanalysis' },
    { label: 'Historical pattern', percentage: 13, color: '#00cc66', description: '7-day historical station data pattern' },
  ],
  'AZ-04': [
    { label: 'NO2 (satellite)', percentage: 30, color: '#1e90ff', description: 'Tropospheric NO2 column density from Sentinel-5P' },
    { label: 'AOD (aerosol optical depth)', percentage: 26, color: '#00d4ff', description: 'Aerosol optical depth from MODIS/Aqua' },
    { label: 'Weather (ERA5)', percentage: 25, color: '#ffaa00', description: 'Temperature, humidity, wind speed from ERA5 reanalysis' },
    { label: 'Historical pattern', percentage: 19, color: '#00cc66', description: '7-day historical station data pattern' },
  ],
};

const DEFAULT_FACTORS: FactorBreakdown[] = [
  { label: 'NO2 (satellite)', percentage: 35, color: '#1e90ff', description: 'Tropospheric NO2 column density from Sentinel-5P' },
  { label: 'AOD (aerosol optical depth)', percentage: 28, color: '#00d4ff', description: 'Aerosol optical depth from MODIS/Aqua' },
  { label: 'Weather (ERA5)', percentage: 22, color: '#ffaa00', description: 'Temperature, humidity, wind speed from ERA5 reanalysis' },
  { label: 'Historical pattern', percentage: 15, color: '#00cc66', description: '7-day historical station data pattern' },
];

export async function getExplanation(locationId: string): Promise<FactorBreakdown[]> {
  await delay(400);
  return STATION_FACTORS[locationId] ?? DEFAULT_FACTORS;
}
