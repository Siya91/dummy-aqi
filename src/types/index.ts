// ── AirSense Nagpur — shared type definitions ─────────────────────

export type AqiCategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface TrendPoint {
  time: string; // "HH:00"
  pm25: number;
}

export interface Station {
  station_id: string;
  name: string;
  lat: number;
  lng: number;
  pm25: number;
  aqi: number;
  category: AqiCategory;
  timestamp: string; // ISO
  trend: TrendPoint[];
}

export interface ForecastPoint {
  date: string; // "YYYY-MM-DD"
  actual: number | null;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export interface ModelMetrics {
  model: string;
  r2: number;
  rmse: number;
  mae: number;
  status: 'active' | 'planned';
}

export interface Plume {
  id: string;
  sourceLat: number;
  sourceLng: number;
  name: string;
  hchoConcentration: number; // mol/m²
  windDirection: number; // degrees
  windSpeed: number; // m/s
  confidence: number; // 0–1
  transboundary: boolean;
  detectedAt: string;
  trajectory: [number, number][]; // [lat, lng] pairs
}

export interface BiomassHotspot {
  lat: number;
  lng: number;
  intensity: number; // 0–1
  radius: number; // meters
  detectedAt: string;
}

export interface HeatPoint {
  lat: number;
  lng: number;
  pm25: number;
}

export interface PredictedArea {
  area_id: string;
  name: string;
  lat: number;
  lng: number;
  pm25: number;
  aqi: number;
  category: AqiCategory;
  confidence: number; // 0–1, satellite model confidence
  timestamp: string;
  trend: TrendPoint[];
}

export type ScreenTab = 'dashboard' | 'predictions' | 'plume';

export interface FactorBreakdown {
  label: string;
  percentage: number;
  color: string;
  description: string;
}

export type ThemeMode = 'dark' | 'light';
export type AppRoute = 'landing' | 'app';

export type AqiColor = '#00cc66' | '#ffaa00' | '#ff8844' | '#ff4444' | '#aa00ff' | '#7a0010';
