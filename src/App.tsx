import { useState, useEffect } from 'react';
import type { ScreenTab, ThemeMode, AppRoute } from '@/types';
import Navbar from '@/components/Navbar';
import DashboardScreen from '@/screens/DashboardScreen';
import PredictionsScreen from '@/screens/PredictionsScreen';
import PlumeTrackerScreen from '@/screens/PlumeTrackerScreen';
import LandingScreen from '@/screens/LandingScreen';
import '@/lib/leafletSetup';

function App() {
  const [route, setRoute] = useState<AppRoute>('landing');
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const goHome = () => {
    setRoute('landing');
  };

  const launchApp = () => {
    setRoute('app');
  };

  if (route === 'landing') {
    return <LandingScreen onLaunch={launchApp} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--airsense-bg)' }}>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={goHome}
      />

      <main className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
        {activeTab === 'predictions' && (
          <PredictionsScreen
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
        {activeTab === 'plume' && <PlumeTrackerScreen />}
      </main>
    </div>
  );
}

export default App;
