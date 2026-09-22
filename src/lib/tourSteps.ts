import type { PortalSection } from '@/types';

export interface TourStep {
  section: PortalSection;
  title: string;
  subtitle: string;
  points: string[];
  duration: number; // ms to display before auto-advancing
}

export const TOUR_STEPS: TourStep[] = [
  {
    section: 'dashboard',
    title: 'Dashboard Overview',
    subtitle: 'Real-time Air Quality Intelligence',
    points: [
      'KPI strip shows current AQI, PM2.5, active stations, and last update time for Nagpur.',
      'Interactive map displays 4 live CPCB ground stations color-coded by AQI category.',
      'Prediction heatmap overlays satellite-derived PM2.5 estimates across ~50 grid points.',
      'Right panel shows station details, 24h trend chart, and AI factor breakdown.',
      'Click any marker to fly the map to that location with a pulsing highlight.',
    ],
    duration: 12000,
  },
  {
    section: 'live-aqi-map',
    title: 'Live AQI Map',
    subtitle: 'Satellite-Fused Air Quality Surveillance',
    points: [
      'Full-screen interactive map centered on Nagpur (21.1458°N, 79.0882°E).',
      'Toggle the prediction heatmap to reveal satellite-estimated pollution across unmonitored areas.',
      'Legend distinguishes live CPCB stations from satellite-predicted points.',
      'Covers greater Nagpur: Kalmeshwar, Hingna, Kamptee, Mauda, Wadi, and Godhani.',
    ],
    duration: 10000,
  },
  {
    section: 'hotspot-analysis',
    title: 'Hotspot Analysis — Module 2',
    subtitle: 'HCHO Plume & Biomass Burning Detection',
    points: [
      'Tracks formaldehyde (HCHO) concentration plumes using satellite data.',
      'Detects biomass burning hotspots with intensity and radius metadata.',
      'Wind direction arrows show pollution trajectory and source origin.',
      'Transboundary flag badges identify pollution originating outside Nagpur.',
      'Side panel lists all detected plumes with source coords, trajectory, and confidence.',
    ],
    duration: 11000,
  },
  {
    section: 'satellite-data',
    title: 'Satellite Data Sources',
    subtitle: 'Multi-Sensor Data Fusion Pipeline',
    points: [
      'Sentinel-5P TROPOMI provides tropospheric NO2 column density at 7×3.5 km resolution.',
      'MODIS Aqua/Terra supplies Aerosol Optical Depth (AOD) at 1 km resolution, twice daily.',
      'ERA5 reanalysis contributes temperature, humidity, and wind speed at hourly cadence.',
      'All sources are fused through a Random Forest model to produce PM2.5 predictions.',
      'CNN-LSTM deep learning model is in development for the next phase.',
    ],
    duration: 10000,
  },
  {
    section: 'predictions',
    title: '7-Day AQI Forecast',
    subtitle: 'AI-Powered Predictive Modeling',
    points: [
      '7-day forecast chart with actual vs predicted PM2.5 and confidence bands.',
      'Random Forest baseline achieves R² = 0.82, RMSE = 8.3 µg/m³.',
      'CNN-LSTM model targeting R² > 0.90 with spatiotemporal dynamics — next phase.',
      'Select any station or predicted area to view its individual forecast.',
      'Summary stats show predicted peak, low, and average confidence interval.',
    ],
    duration: 11000,
  },
  {
    section: 'reports',
    title: 'Reports & Documentation',
    subtitle: 'Automated Report Generation',
    points: [
      'Daily AQI summaries generated automatically at 23:59 IST.',
      'Hotspot analysis reports triggered on plume detection events.',
      'Weekly model accuracy assessments published every Sunday.',
      'All reports available for download in PDF format.',
    ],
    duration: 9000,
  },
  {
    section: 'about',
    title: 'About AirSense Nagpur',
    subtitle: 'Project Overview & Vision',
    points: [
      'Satellite-based air quality monitoring for the Nagpur pilot region.',
      'Module 1: AQI prediction using satellite fusion + Random Forest ML.',
      'Module 2: Plume tracking with HCHO detection and biomass burning alerts.',
      'Covers greater Nagpur with 4 CPCB reference stations and ~50 prediction grid points.',
      'Designed for replication across other Indian cities in future phases.',
    ],
    duration: 10000,
  },
];
