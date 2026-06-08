import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}', '!./src/lib/**'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#0D1117', surface: '#161B22', card: '#1C2128', elevated: '#21262D' },
        border: { DEFAULT: '#30363D', subtle: '#21262D', strong: '#3D444D' },
        primary: { DEFAULT: '#3B82F6', hover: '#2563EB', light: '#60A5FA' },
        accent:  { DEFAULT: '#8B5CF6', hover: '#7C3AED', light: '#A78BFA' },
        success: { DEFAULT: '#10B981', light: '#34D399' },
        danger:  { DEFAULT: '#EF4444', light: '#F87171' },
        warning: { DEFAULT: '#F59E0B', light: '#FCD34D' },
        text: { primary: '#E6EDF3', secondary: '#8B949E', muted: '#6E7681' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
