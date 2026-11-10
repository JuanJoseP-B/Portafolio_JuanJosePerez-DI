import type { Config } from 'tailwindcss';

// Values mirror src/styles/tokens.css (source: portafolio-libro-kit/design-system).
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: 'rgb(var(--void-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised-rgb) / <alpha-value>)',
        glass: 'var(--glass)',
        'glass-border': 'var(--glass-border)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-warm': 'rgb(var(--accent-warm-rgb) / <alpha-value>)',
        paper: '#ece4d2',
        'paper-white': '#f7f5ef',
        'paper-ink': '#1b1813',
        'paper-muted': '#5e564a',
        cover: '#12151f',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
        'accent-hover': 'rgb(var(--accent-hover-rgb) / <alpha-value>)',
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
        'glow-accent': 'var(--glow-accent)',
        glass: 'var(--glass-shadow)',
        note: 'var(--note-shadow)',
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
