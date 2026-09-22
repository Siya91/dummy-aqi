import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode, AppRoute, PortalSection } from '@/types';
import Navbar from '@/components/Navbar';
import PortalScreen from '@/screens/PortalScreen';
import LandingScreen from '@/screens/LandingScreen';
import DemoTour from '@/components/DemoTour';
import '@/lib/leafletSetup';

function App() {
  const [route, setRoute] = useState<AppRoute>('landing');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<PortalSection>('dashboard');
  const [scrollTarget, setScrollTarget] = useState<PortalSection | null>(null);
  const [demoActive, setDemoActive] = useState(false);

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

  const handleSectionClick = useCallback((section: PortalSection) => {
    setScrollTarget(section);
  }, []);

  const handleScrollTargetHandled = useCallback(() => {
    setScrollTarget(null);
  }, []);

  const handleDemoNavigate = useCallback((section: PortalSection) => {
    setScrollTarget(section);
  }, []);

  const startDemo = () => {
    setDemoActive(true);
  };

  const closeDemo = () => {
    setDemoActive(false);
  };

  if (route === 'landing') {
    return <LandingScreen onLaunch={launchApp} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--airsense-bg)' }}>
      <Navbar
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={goHome}
        onStartDemo={startDemo}
      />
      <main className={`flex-1 ${demoActive ? 'pb-44' : ''}`}>
        <PortalScreen
          selectedId={selectedId}
          onSelect={setSelectedId}
          activeSection={activeSection}
          onActiveSectionChange={setActiveSection}
          scrollTarget={scrollTarget}
          onScrollTargetHandled={handleScrollTargetHandled}
        />
      </main>
      <DemoTour
        active={demoActive}
        onClose={closeDemo}
        onNavigate={handleDemoNavigate}
      />
    </div>
  );
}

export default App;
