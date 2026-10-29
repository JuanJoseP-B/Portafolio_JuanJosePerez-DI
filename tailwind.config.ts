import type { Config } from 'tailwindcss';

// Values mirror src/styles/tokens.css (source: portafolio-libro-kit/design-system).
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05060a',
        surface: '#0d1018',
        'surface-raised': '#161a26',
        glass: 'rgba(255, 255, 255, 0.06)',
        'glass-border': 'rgba(255, 255, 255, 0.14)',
        ink: '#f4f6fb',
        muted: '#9aa3b5',
        accent: '#5ce1e6',
        'accent-warm': '#ffb547',
        paper: '#ece4d2',
        'paper-white': '#f7f5ef',
        'paper-ink': '#1b1813',
        'paper-muted': '#5e564a',
        cover: '#12151f',
        success: '#7ee2a8',
        'accent-hover': '#b8f6fa',
        'keycap-shadow': '#0a0c12',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        xl: '24px',
        pill: '999px',
        btn: '4px',
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(92, 225, 230, 0.35)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
        note: '0 12px 28px rgba(0, 0, 0, 0.45)',
      },
      spacing: {
        'space-2': '8px',
        'space-4': '16px',
        'space-6': '24px',
        'space-10': '40px',
      },
    },
  },
  plugins: [],
};

export default config;
