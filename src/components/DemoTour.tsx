import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, ChevronRight, ChevronLeft, Presentation } from 'lucide-react';
import type { PortalSection } from '@/types';
import { TOUR_STEPS } from '@/lib/tourSteps';

interface DemoTourProps {
  active: boolean;
  onClose: () => void;
  onNavigate: (section: PortalSection) => void;
}

export default function DemoTour({ active, onClose, onNavigate }: DemoTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = TOUR_STEPS[stepIndex];
  const totalSteps = TOUR_STEPS.length;

  // Navigate to section when step changes
  const navigateToStep = useCallback((index: number) => {
    const step = TOUR_STEPS[index];
    onNavigate(step.section);
  }, [onNavigate]);

  // Start tour
  useEffect(() => {
    if (active) {
      setStepIndex(0);
      setPlaying(true);
      setProgress(0);
      navigateToStep(0);
    }
  }, [active, navigateToStep]);

  // Auto-advance timer
  useEffect(() => {
    if (!active || !playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const duration = currentStep.duration;

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
    }, 50);

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSteps) {
          setPlaying(false);
          return prev;
        }
        navigateToStep(next);
        return next;
      });
    }, duration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, playing, stepIndex, currentStep.duration, totalSteps, navigateToStep]);

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setProgress(0);
      navigateToStep(next);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      setProgress(0);
      navigateToStep(prev);
    }
  };

  const handlePlayPause = () => {
    setPlaying((p) => !p);
  };

  if (!active) return null;

  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <>
      {/* Bottom presentation bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[2000] shadow-2xl animate-slide-up"
        style={{ background: '#0a1a3a', borderTop: '2px solid #1e90ff' }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: '#1a3a6a' }}>
          <div
            className="h-full transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1e90ff, #00d4ff)',
            }}
          />
        </div>

        <div className="px-4 md:px-8 py-4">
          <div className="flex items-start gap-4 max-w-6xl mx-auto">
            {/* Step badge */}
            <div className="flex-shrink-0 hidden md:flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #1e90ff, #00d4ff)' }}
              >
                {stepIndex + 1}
              </div>
              <span className="text-[10px] font-mono text-blue-200">
                / {totalSteps}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Presentation className="w-4 h-4 text-airsense-accent flex-shrink-0" />
                <h3 className="text-base md:text-lg font-bold text-white truncate">
                  {currentStep.title}
                </h3>
                <span className="hidden sm:inline text-xs font-mono text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                  {currentStep.subtitle}
                </span>
              </div>

              {/* Talking points — typewriter-style reveal */}
              <div className="space-y-1">
                {currentStep.points.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs md:text-sm text-blue-100 animate-fade-in"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <span className="text-airsense-accent flex-shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous section"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-2.5 rounded-lg text-white transition-colors"
                style={{ background: playing ? 'rgba(255,68,68,0.2)' : 'rgba(0,212,255,0.2)' }}
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={handleNext}
                disabled={isLastStep && !playing}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next section"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="w-px h-8 bg-blue-400/20 mx-1" />

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Exit demo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setStepIndex(i);
                  setProgress(0);
                  navigateToStep(i);
                }}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === stepIndex ? '32px' : '12px',
                  background: i === stepIndex ? '#00d4ff' : i < stepIndex ? '#1e90ff' : '#1a3a6a',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top-right "Demo Mode" badge */}
      <div
        className="fixed top-20 right-4 z-[2000] px-3 py-1.5 rounded-full text-xs font-bold text-white animate-fade-in flex items-center gap-2 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff4444, #ff8800)' }}
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        DEMO MODE
      </div>
    </>
  );
}
