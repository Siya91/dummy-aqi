import { useState } from 'react';
import { Satellite, Brain, Wind, ArrowRight, Mail, Lock, User, LogIn } from 'lucide-react';

interface LandingScreenProps {
  onLaunch: () => void;
}

// Simplified India outline SVG path (right-of-center, faint)
const INDIA_PATH =
  'M 120 40 Q 140 35 155 45 L 170 50 Q 185 55 190 70 L 195 85 Q 200 100 195 115 L 185 130 Q 175 145 165 155 L 150 165 Q 135 170 125 165 L 115 155 Q 105 140 100 125 L 95 110 Q 90 95 95 80 L 105 65 Q 110 50 120 40 Z';

// Nagpur position within the SVG viewBox (approximately center of India)
const NAGPUR_X = 150;
const NAGPUR_Y = 115;

// Star positions (pre-computed for stable layout)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  cx: (i * 37) % 400 + 10,
  cy: (i * 53) % 300 + 10,
  r: (i % 3) * 0.4 + 0.5,
  delay: (i % 7) * 0.5,
}));

// Floating particle positions
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8 + 5) % 100}%`,
  delay: `${i * 0.8}s`,
  duration: `${8 + (i % 4) * 2}s`,
}));

export default function LandingScreen({ onLaunch }: LandingScreenProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLaunch();
  };

  const handleGuest = () => {
    onLaunch();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--airsense-bg)' }}>
      {/* ── Animated hero background ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, var(--airsense-surface-2) 0%, var(--airsense-bg) 70%)',
          }}
        />

        {/* Starfield */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#ffffff"
              opacity="0.6"
              style={{ animation: `twinkle 3s ease-in-out ${s.delay}s infinite` }}
            />
          ))}
        </svg>

        {/* India outline + Nagpur radar ping */}
        <svg
          className="absolute"
          style={{ right: '8%', top: '15%', width: '320px', height: '260px', opacity: 0.5 }}
          viewBox="0 0 250 220"
        >
          {/* India outline */}
          <path
            d={INDIA_PATH}
            fill="none"
            stroke="#1e90ff"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="3 2"
          />
          {/* Nagpur radar rings */}
          <circle cx={NAGPUR_X} cy={NAGPUR_Y} r="4" fill="#00d4ff">
            <animate attributeName="r" values="4;4" dur="0.1s" />
          </circle>
          <circle cx={NAGPUR_X} cy={NAGPUR_Y} r="4" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="4;30" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={NAGPUR_X} cy={NAGPUR_Y} r="4" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="4;30" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
          </circle>
          <text x={NAGPUR_X + 8} y={NAGPUR_Y + 4} fill="#00d4ff" fontSize="9" fontFamily="JetBrains Mono" opacity="0.5">
            Nagpur
          </text>
        </svg>

        {/* Satellite orbit path + traveling satellite */}
        <svg
          className="absolute"
          style={{ top: '0', left: '0', width: '100%', height: '40%' }}
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            d="M -50 120 Q 300 40 600 80 Q 900 120 1250 60"
            fill="none"
            stroke="#1e90ff"
            strokeWidth="1"
            strokeDasharray="6 4"
            opacity="0.2"
          />
          <g>
            <circle r="4" fill="#00d4ff" opacity="0.8">
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                path="M -50 120 Q 300 40 600 80 Q 900 120 1250 60"
              />
            </circle>
            <g>
              <rect x="-6" y="-3" width="12" height="6" rx="1" fill="#1e90ff" opacity="0.7" />
              <line x1="-10" y1="0" x2="-6" y2="0" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
              <line x1="6" y1="0" x2="10" y2="0" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                path="M -50 120 Q 300 40 600 80 Q 900 120 1250 60"
              />
            </g>
          </g>
        </svg>

        {/* Scanning line sweep */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)',
            animation: 'scanSweep 6s linear infinite',
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute bottom-0 rounded-full"
            style={{
              left: p.left,
              width: '3px',
              height: '3px',
              background: i % 2 === 0 ? '#00d4ff' : '#1e90ff',
              opacity: 0.3,
              animation: `floatUp ${p.duration} ease-in ${p.delay} infinite`,
            }}
          />
        ))}

        {/* Dark gradient overlay behind text for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(6,13,26,0.4) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Content (z-10 to sit above background) ─────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-airsense-primary to-airsense-accent flex items-center justify-center glow-primary">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight" style={{ color: 'var(--airsense-text)' }}>
                AirSense <span className="text-airsense-accent">Nagpur</span>
              </h1>
              <p className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                AI Satellite Pollution Monitoring
              </p>
            </div>
          </div>
        </header>

        {/* Hero */}
        {!showLogin ? (
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-4xl w-full text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-8 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-airsense-safe animate-pulse" />
                <span className="text-xs font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                  Live satellite data · Sentinel-5P · MODIS · ERA5
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-slide-up" style={{ color: 'var(--airsense-text)' }}>
                Satellite-based AQI
                <br />
                <span className="bg-gradient-to-r from-airsense-primary to-airsense-accent bg-clip-text text-transparent">
                  Prediction for Nagpur
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ color: 'var(--airsense-text-muted)' }}>
                AI-powered air quality monitoring that fuses satellite NO2, aerosol optical depth,
                and meteorological data to predict PM2.5 across Nagpur — even where no ground
                stations exist.
              </p>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  {
                    icon: Satellite,
                    title: 'Satellite Fusion',
                    desc: 'Combines Sentinel-5P NO2, MODIS AOD, and ERA5 weather data to estimate pollution in unmonitored areas.',
                    color: '#1e90ff',
                  },
                  {
                    icon: Brain,
                    title: 'AI Prediction',
                    desc: 'Random Forest model with 82% R² accuracy. CNN-LSTM deep learning model in development for next phase.',
                    color: '#00d4ff',
                  },
                  {
                    icon: Wind,
                    title: 'Plume Tracking',
                    desc: 'Detects HCHO concentration plumes and biomass burning hotspots with wind trajectory analysis.',
                    color: '#ffaa00',
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="glass-panel rounded-xl p-5 text-left animate-slide-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
                        style={{ background: `${feature.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--airsense-text)' }}>
                        {feature.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--airsense-text-muted)' }}>
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-airsense-primary to-airsense-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-primary animate-fade-in"
                >
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGuest}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass-panel font-medium text-sm transition-colors hover:border-airsense-primary/40 animate-fade-in"
                  style={{ color: 'var(--airsense-text)' }}
                >
                  <User className="w-4 h-4" />
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Login form */
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
              <div className="glass-panel rounded-2xl p-8 animate-slide-up">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-airsense-primary to-airsense-accent flex items-center justify-center mx-auto mb-4 glow-primary">
                    <Satellite className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--airsense-text)' }}>
                    Sign in to AirSense
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--airsense-text-muted)' }}>
                    Access the satellite pollution monitoring dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono mb-1.5 block" style={{ color: 'var(--airsense-text-muted)' }}>
                      Email
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: 'var(--airsense-surface)', borderColor: 'var(--airsense-border)' }}>
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--airsense-text-muted)' }} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="researcher@airsense.in"
                        className="bg-transparent text-sm outline-none flex-1"
                        style={{ color: 'var(--airsense-text)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono mb-1.5 block" style={{ color: 'var(--airsense-text-muted)' }}>
                      Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: 'var(--airsense-surface)', borderColor: 'var(--airsense-border)' }}>
                      <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--airsense-text-muted)' }} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent text-sm outline-none flex-1"
                        style={{ color: 'var(--airsense-text)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-airsense-primary to-airsense-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--airsense-border)' }}>
                  <button
                    onClick={handleGuest}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-airsense-primary/10"
                    style={{ color: 'var(--airsense-text-muted)' }}
                  >
                    <User className="w-4 h-4" />
                    Continue as Guest
                  </button>
                </div>

                <button
                  onClick={() => setShowLogin(false)}
                  className="w-full text-center text-xs mt-4 transition-colors hover:text-airsense-accent"
                  style={{ color: 'var(--airsense-text-muted)' }}
                >
                  Back to home
                </button>
              </div>
              <p className="text-center text-[10px] mt-4 font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                Demo only — no real authentication. Any email/password will work.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="px-6 py-4 text-center">
          <p className="text-[10px] font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
            AirSense Nagpur · Satellite-based AQI prediction · © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
