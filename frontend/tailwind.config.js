/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jansakhi: {
          navy: '#02285C',
          navyLight: '#0B3A7E',
          navyBg: '#EEF4FF',
          saffron: '#FD890E',
          saffronDark: '#D86B02',
          saffronLight: '#FFF4E6',
          green: '#197338',
          greenHover: '#135C2C',
          greenLight: '#EAF5EE',
          wave: '#0275E9',
          waveLight: '#EBF5FF',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          textMain: '#0F172A',
          textMuted: '#475569',
          border: '#E2E8F0',
          darkBg: '#0A1128',
          darkCard: '#131F42',
          darkBorder: '#1E2F5D',
          darkText: '#F1F5F9',
          darkMuted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
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
        'soft': '0 4px 20px -2px rgba(2, 40, 92, 0.08), 0 2px 6px -1px rgba(2, 40, 92, 0.04)',
        'lifted': '0 10px 25px -3px rgba(25, 115, 56, 0.18), 0 4px 6px -2px rgba(25, 115, 56, 0.08)',
        'voice': '0 0 0 8px rgba(2, 117, 233, 0.2), 0 0 0 16px rgba(2, 117, 233, 0.1)',
        'voice-active': '0 0 0 12px rgba(253, 137, 14, 0.3), 0 0 0 24px rgba(253, 137, 14, 0.15)',
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
