import { Satellite, Database, Globe, Activity } from 'lucide-react';

export default function SatelliteDataSection() {
  const satellites = [
    {
      name: 'Sentinel-5P',
      instrument: 'TROPOMI',
      parameter: 'NO2 (Tropospheric)',
      resolution: '7 × 3.5 km',
      cadence: 'Daily',
      status: 'Active',
      color: '#1e90ff',
    },
    {
      name: 'MODIS (Aqua/Terra)',
      instrument: 'MODIS',
      parameter: 'AOD (Aerosol Optical Depth)',
      resolution: '1 × 1 km',
      cadence: 'Twice daily',
      status: 'Active',
      color: '#00d4ff',
    },
    {
      name: 'ERA5 Reanalysis',
      instrument: 'ECMWF',
      parameter: 'Temperature, Humidity, Wind',
      resolution: '0.25° × 0.25°',
      cadence: 'Hourly',
      status: 'Active',
      color: '#ffaa00',
    },
    {
      name: 'Sentinel-2',
      instrument: 'MSI',
      parameter: 'Land Cover / Biomass',
      resolution: '10 × 10 m',
      cadence: '5 days',
      status: 'Active',
      color: '#00cc66',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {satellites.map((sat) => (
        <div
          key={sat.name}
          className="glass-panel rounded-xl p-5 border"
          style={{ borderColor: 'var(--airsense-border)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${sat.color}15` }}
            >
              <Satellite className="w-5 h-5" style={{ color: sat.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold" style={{ color: 'var(--airsense-text)' }}>
                {sat.name}
              </h3>
              <p className="text-xs font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                {sat.instrument}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-airsense-safe/15 text-airsense-safe border border-airsense-safe/30">
              {sat.status}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--airsense-text-muted)' }}>
                <Database className="w-3.5 h-3.5" />
                Parameter
              </span>
              <span className="font-medium" style={{ color: 'var(--airsense-text)' }}>
                {sat.parameter}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--airsense-text-muted)' }}>
                <Globe className="w-3.5 h-3.5" />
                Resolution
              </span>
              <span className="font-mono" style={{ color: 'var(--airsense-text)' }}>
                {sat.resolution}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--airsense-text-muted)' }}>
                <Activity className="w-3.5 h-3.5" />
                Cadence
              </span>
              <span className="font-mono" style={{ color: 'var(--airsense-text)' }}>
                {sat.cadence}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Data pipeline info */}
      <div className="md:col-span-2 glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--airsense-text)' }}>
          Data Fusion Pipeline
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-3 text-xs">
          {['Satellite NO2', 'AOD', 'ERA5 Weather', 'Historical PM2.5', 'ML Model', 'AQI Prediction'].map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="px-3 py-2 rounded-lg font-mono font-medium"
                style={{
                  background: 'var(--airsense-surface-2)',
                  color: 'var(--airsense-text)',
                  border: '1px solid var(--airsense-border)',
                }}
              >
                {step}
              </div>
              {idx < 5 && <span className="text-airsense-accent font-bold">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
          Multi-source satellite data is fused with ground station observations through a
          Random Forest regression model to produce PM2.5 estimates at unmonitored locations
          across the Nagpur pilot region.
        </p>
      </div>
    </div>
  );
}
