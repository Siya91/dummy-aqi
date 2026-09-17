import type { AqiCategory, AqiColor } from '@/types';

export function aqiToCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function aqiToColor(aqi: number): AqiColor {
  if (aqi <= 50) return '#00cc66';
  if (aqi <= 100) return '#ffaa00';
  if (aqi <= 150) return '#ff8844';
  if (aqi <= 200) return '#ff4444';
  if (aqi <= 300) return '#aa00ff';
  return '#7a0010';
}

export function aqiToTextColor(aqi: number): string {
  if (aqi <= 50) return 'text-aqi-good';
  if (aqi <= 100) return 'text-aqi-moderate';
  if (aqi <= 150) return 'text-aqi-unhealthy';
  if (aqi <= 200) return 'text-aqi-bad';
  if (aqi <= 300) return 'text-aqi-verybad';
  return 'text-aqi-hazardous';
}

export function aqiToBgColor(aqi: number): string {
  if (aqi <= 50) return 'bg-aqi-good';
  if (aqi <= 100) return 'bg-aqi-moderate';
  if (aqi <= 150) return 'bg-aqi-unhealthy';
  if (aqi <= 200) return 'bg-aqi-bad';
  if (aqi <= 300) return 'bg-aqi-verybad';
  return 'bg-aqi-hazardous';
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
