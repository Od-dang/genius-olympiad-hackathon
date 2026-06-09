import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020c1a',
          900: '#05111f',
          800: '#0a1e35',
          700: '#0f2a4a',
          600: '#163760',
        },
        risk: {
          none:     '#6b7280',
          low:      '#22c55e',
          moderate: '#eab308',
          high:     '#f97316',
          critical: '#ef4444',
        },
      },
      backgroundImage: {
        'navbar-gradient': 'linear-gradient(135deg, #0a1e35 0%, #0f2a4a 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
