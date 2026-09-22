import { FileText, Download, Calendar, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ReportsSection() {
  const reports = [
    {
      title: 'Daily AQI Summary — Nagpur Region',
      date: '2026-09-22',
      type: 'Daily Report',
      size: '2.4 MB',
      icon: FileText,
      color: '#1e90ff',
    },
    {
      title: 'Hotspot Analysis — HCHO Plume Detection',
      date: '2026-09-21',
      type: 'Module 2 Report',
      size: '5.1 MB',
      icon: AlertTriangle,
      color: '#ffaa00',
    },
    {
      title: '7-Day Forecast Accuracy Assessment',
      date: '2026-09-20',
      type: 'Model Report',
      size: '1.8 MB',
      icon: TrendingUp,
      color: '#00d4ff',
    },
    {
      title: 'Station-wise PM2.5 Trend Report',
      date: '2026-09-19',
      type: 'Station Report',
      size: '3.2 MB',
      icon: MapPin,
      color: '#00cc66',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="glass-panel rounded-xl p-5 border flex items-start gap-4"
              style={{ borderColor: 'var(--airsense-border)' }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${report.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: report.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--airsense-text)' }}>
                  {report.title}
                </h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {report.date}
                  </span>
                  <span className="font-mono">{report.type}</span>
                  <span className="font-mono">{report.size}</span>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-airsense-primary/10"
                style={{ borderColor: 'var(--airsense-border)', color: 'var(--airsense-text-muted)' }}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="glass-panel rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--airsense-text)' }}>
          Report Generation Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-airsense-safe" />
            Daily summaries generated at 23:59 IST
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-airsense-warning" />
            Hotspot reports generated on detection
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--airsense-text-muted)' }}>
            <div className="w-2 h-2 rounded-full bg-airsense-primary" />
            Model accuracy reports weekly on Sundays
          </div>
        </div>
      </div>
    </div>
  );
}
