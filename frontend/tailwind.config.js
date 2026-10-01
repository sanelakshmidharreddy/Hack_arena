/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        guide: {
          blue: '#1E40AF',
          blueHover: '#1D4ED8',
          blueLight: '#EFF6FF',
          accent: '#6366F1',
          accentPurple: '#7C3AED',
          accentLight: '#F5F3FF',
          green: '#059669',
          greenLight: '#ECFDF5',
          warning: '#D97706',
          warningLight: '#FFFBEB',
          surface: '#FFFFFF',
          background: '#F8FAFC',
          card: '#FFFFFF',
          textMain: '#0F172A',
          textMuted: '#475569',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: [
          'Noto Sans',
          'Noto Sans Telugu',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'lifted': '0 10px 25px -3px rgba(30, 64, 175, 0.15), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
        'voice': '0 0 0 8px rgba(99, 102, 241, 0.2), 0 0 0 16px rgba(99, 102, 241, 0.1)',
        'voice-active': '0 0 0 12px rgba(124, 58, 237, 0.3), 0 0 0 24px rgba(124, 58, 237, 0.15)',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
