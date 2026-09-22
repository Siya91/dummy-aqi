import { useEffect, useRef } from 'react';
import { LayoutDashboard, MapPin, Flame, Radio, TrendingUp, FileText, Info } from 'lucide-react';
import type { PortalSection } from '@/types';
import SectionWrapper from '@/components/SectionWrapper';
import DashboardScreen from '@/screens/DashboardScreen';
import LiveAqiMapSection from '@/components/sections/LiveAqiMapSection';
import PlumeTrackerScreen from '@/screens/PlumeTrackerScreen';
import SatelliteDataSection from '@/components/sections/SatelliteDataSection';
import PredictionsScreen from '@/screens/PredictionsScreen';
import ReportsSection from '@/components/sections/ReportsSection';
import AboutSection from '@/components/sections/AboutSection';

interface PortalScreenProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  activeSection: PortalSection;
  onActiveSectionChange: (section: PortalSection) => void;
  scrollTarget: PortalSection | null;
  onScrollTargetHandled: () => void;
}

const SECTION_IDS: PortalSection[] = [
  'dashboard',
  'live-aqi-map',
  'hotspot-analysis',
  'satellite-data',
  'predictions',
  'reports',
  'about',
];

export default function PortalScreen({
  selectedId,
  onSelect,
  activeSection,
  onActiveSectionChange,
  scrollTarget,
  onScrollTargetHandled,
}: PortalScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to section when a tab is clicked
  useEffect(() => {
    if (!scrollTarget) return;
    const el = document.getElementById(scrollTarget);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onScrollTargetHandled();
  }, [scrollTarget, onScrollTargetHandled]);

  // Scroll-spy: detect which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            if (!best || ratio > best.ratio) {
              best = { id: entry.target.id, ratio };
            }
          }
        }
        if (best) {
          onActiveSectionChange(best.id as PortalSection);
        }
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [onActiveSectionChange]);

  return (
    <div ref={containerRef}>
      {/* Dashboard section — KPIs + map + side panel */}
      <SectionWrapper
        id="dashboard"
        title="Dashboard"
        icon={<LayoutDashboard className="w-6 h-6 text-airsense-primary" />}
      >
        <DashboardScreen selectedId={selectedId} onSelect={onSelect} />
      </SectionWrapper>

      {/* Live AQI Map section */}
      <SectionWrapper
        id="live-aqi-map"
        title="Live AQI Map"
        icon={<MapPin className="w-6 h-6 text-airsense-accent" />}
      >
        <LiveAqiMapSection />
      </SectionWrapper>

      {/* Hotspot Analysis section — Plume Tracker */}
      <SectionWrapper
        id="hotspot-analysis"
        title="Hotspot Analysis"
        icon={<Flame className="w-6 h-6 text-airsense-warning" />}
      >
        <PlumeTrackerScreen />
      </SectionWrapper>

      {/* Satellite Data section */}
      <SectionWrapper
        id="satellite-data"
        title="Satellite Data"
        icon={<Radio className="w-6 h-6 text-airsense-primary" />}
      >
        <SatelliteDataSection />
      </SectionWrapper>

      {/* Predictions section */}
      <SectionWrapper
        id="predictions"
        title="Predictions"
        icon={<TrendingUp className="w-6 h-6 text-airsense-accent" />}
      >
        <PredictionsScreen selectedId={selectedId} onSelect={onSelect} />
      </SectionWrapper>

      {/* Reports section */}
      <SectionWrapper
        id="reports"
        title="Reports"
        icon={<FileText className="w-6 h-6 text-airsense-primary" />}
      >
        <ReportsSection />
      </SectionWrapper>

      {/* About section */}
      <SectionWrapper
        id="about"
        title="About"
        icon={<Info className="w-6 h-6 text-airsense-accent" />}
      >
        <AboutSection />
      </SectionWrapper>
    </div>
  );
}
