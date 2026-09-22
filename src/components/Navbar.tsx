import { useState } from 'react';
import { Satellite, LayoutDashboard, MapPin, Flame, Radio, TrendingUp, FileText, Info, Sun, Moon, Home, Menu, X } from 'lucide-react';
import type { PortalSection, ThemeMode } from '@/types';

interface NavbarProps {
  activeSection: PortalSection;
  onSectionClick: (section: PortalSection) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onGoHome: () => void;
}

const TABS: { id: PortalSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-aqi-map', label: 'Live AQI Map', icon: MapPin },
  { id: 'hotspot-analysis', label: 'Hotspot Analysis', icon: Flame },
  { id: 'satellite-data', label: 'Satellite Data', icon: Radio },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'about', label: 'About', icon: Info },
];

export default function Navbar({ activeSection, onSectionClick, theme, onToggleTheme, onGoHome }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (section: PortalSection) => {
    onSectionClick(section);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-[1000] border-b shadow-sm"
      style={{ background: '#0a1a3a', borderColor: '#1a3a6a' }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button onClick={onGoHome} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-airsense-primary to-airsense-accent flex items-center justify-center">
                <Satellite className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-airsense-safe border-2 animate-pulse" style={{ borderColor: '#0a1a3a' }} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm md:text-base leading-none tracking-tight text-white">
                AirSense <span className="text-airsense-accent">Nagpur</span>
              </h1>
              <p className="text-[9px] md:text-[10px] leading-none mt-0.5 font-mono text-blue-200">
                AI Satellite Pollution Monitoring
              </p>
            </div>
          </button>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-airsense-primary/30 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onGoHome}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: '#1a3a6a', background: '#0a1a3a' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-airsense-primary/30 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
