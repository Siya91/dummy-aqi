import { Satellite, LayoutDashboard, TrendingUp, Wind, Sun, Moon, Home } from 'lucide-react';
import type { ScreenTab, ThemeMode } from '@/types';

interface NavbarProps {
  activeTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onGoHome: () => void;
}

const TABS: { id: ScreenTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'plume', label: 'Plume Tracker', icon: Wind },
];

export default function Navbar({ activeTab, onTabChange, theme, onToggleTheme, onGoHome }: NavbarProps) {
  return (
    <header className="glass-panel sticky top-0 z-[1000] border-b" style={{ borderColor: 'var(--airsense-border)' }}>
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button onClick={onGoHome} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-airsense-primary to-airsense-accent flex items-center justify-center glow-primary group-hover:scale-105 transition-transform">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-airsense-safe border-2 animate-pulse" style={{ borderColor: 'var(--airsense-bg)' }} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base md:text-lg leading-none tracking-tight" style={{ color: 'var(--airsense-text)' }}>
                AirSense <span className="text-airsense-accent">Nagpur</span>
              </h1>
              <p className="text-[10px] md:text-xs leading-none mt-0.5 font-mono" style={{ color: 'var(--airsense-text-muted)' }}>
                AI Satellite Pollution Monitoring
              </p>
            </div>
          </button>
        </div>

        {/* Right side: tabs + controls */}
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <nav className="flex items-center gap-1 md:gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-airsense-primary/20 text-airsense-accent border border-airsense-primary/30'
                      : 'border border-transparent hover:bg-airsense-primary/10'
                  }`}
                  style={{ color: isActive ? undefined : 'var(--airsense-text-muted)' }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Home button */}
          <button
            onClick={onGoHome}
            className="p-2 rounded-lg border border-transparent transition-colors hover:bg-airsense-primary/10"
            style={{ color: 'var(--airsense-text-muted)' }}
            title="Back to home"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-transparent transition-colors hover:bg-airsense-primary/10"
            style={{ color: 'var(--airsense-text-muted)' }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
