/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark aerospace background
        'airsense-bg': '#060d1a',
        'airsense-surface': '#0c1628',
        'airsense-surface-2': '#111e36',
        'airsense-border': '#1a2a4a',
        // Light mode equivalents
        'airsense-bg-light': '#f0f4f8',
        'airsense-surface-light': '#ffffff',
        'airsense-surface-2-light': '#e8eef5',
        'airsense-border-light': '#d0dae8',
        'airsense-text-light': '#1a2a3a',
        'airsense-text-muted-light': '#5a6a80',
        // Primary / accent (same both themes)
        'airsense-primary': '#1e90ff',
        'airsense-accent': '#00d4ff',
        // Status
        'airsense-danger': '#ff4444',
        'airsense-warning': '#ffaa00',
        'airsense-safe': '#00cc66',
        // AQI category colors
        'aqi-good': '#00cc66',
        'aqi-moderate': '#ffaa00',
        'aqi-unhealthy': '#ff8844',
        'aqi-bad': '#ff4444',
        'aqi-verybad': '#aa00ff',
        'aqi-hazardous': '#7a0010',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(30,144,255,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(30,144,255,0)' },
        },
      },
    },
  },
  plugins: [],
};
