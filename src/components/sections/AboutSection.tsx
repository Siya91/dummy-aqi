import { Satellite, Brain, Wind, Target, Users, Mail, Globe, BookOpen } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Project overview */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-airsense-primary to-airsense-accent flex items-center justify-center">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--airsense-text)' }}>
              AirSense Nagpur
            </h3>
            <p className="text-xs font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
              AI Satellite-Based Air Pollution Monitoring
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
          AirSense Nagpur is a satellite-based air quality monitoring system that leverages
          multi-source satellite data (Sentinel-5P NO2, MODIS AOD, ERA5 meteorological reanalysis)
          fused with ground-based CPCB station observations to predict PM2.5 levels across the
          Nagpur pilot region. The system provides real-time AQI estimates even in areas without
          ground monitoring stations, enabling comprehensive air quality surveillance.
        </p>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-airsense-primary/15 flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-airsense-primary" />
          </div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--airsense-text)' }}>
            Module 1: AQI Prediction
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            Random Forest model fusing satellite NO2, AOD, and ERA5 weather data to estimate
            PM2.5 at unmonitored locations. CNN-LSTM deep learning model in development.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-airsense-warning/15 flex items-center justify-center mb-3">
            <Wind className="w-5 h-5 text-airsense-warning" />
          </div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--airsense-text)' }}>
            Module 2: Plume Tracker
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            HCHO concentration tracking and biomass burning hotspot detection with wind
            trajectory analysis and transboundary pollution flagging.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-airsense-accent/15 flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-airsense-accent" />
          </div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--airsense-text)' }}>
            Model Performance
          </h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            Random Forest baseline: R² = 0.82, RMSE = 8.3 µg/m³.
            CNN-LSTM next-phase model targeting R² {'>'} 0.90 with spatiotemporal dynamics.
          </p>
        </div>
      </div>

      {/* Data sources */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-airsense-accent" />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
            Data Sources
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-airsense-primary" />
            Sentinel-5P TROPOMI — Tropospheric NO2 column density
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-airsense-accent" />
            MODIS (Aqua/Terra) — Aerosol Optical Depth (AOD)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-airsense-warning" />
            ERA5 Reanalysis — Temperature, humidity, wind speed
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-airsense-safe" />
            CPCB Ground Stations — PM2.5 reference measurements
          </div>
        </div>
      </div>

      {/* Team / contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-airsense-primary" />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
              Pilot Region
            </h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            Nagpur, Maharashtra (21.1458°N, 79.0882°E) — covering greater Nagpur including
            Kalmeshwar, Hingna, Kamptee, Mauda, Wadi, and Godhani areas with 4 CPCB reference
            stations and ~50 satellite prediction grid points.
          </p>
        </div>
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-airsense-accent" />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--airsense-text)' }}>
              Contact
            </h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
            For data access, API integration, or collaboration inquiries, contact the AirSense
            research team. This is a demonstration portal — all data shown is simulated for
            prototype purposes.
          </p>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
          AirSense Nagpur · Satellite-based AQI Prediction · © 2026 · Demo Prototype
        </p>
      </div>
    </div>
  );
}
