/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          2: 'var(--paper-2)',
        },
        surface: 'var(--surface)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
        },
        muted: 'var(--muted)',
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        orange: {
          DEFAULT: 'var(--orange)',
          hover: 'var(--orange-hover)',
          text: 'var(--orange-text)',
          soft: 'var(--orange-soft)',
          line: 'var(--orange-line)',
        },
        success: 'var(--success)',
        code: {
          bg: 'var(--code-bg)',
          ink: 'var(--code-ink)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        container: '1120px',
        prose: '72ch',
      },
      borderRadius: {
        button: '4px',
        card: '8px',
        image: '6px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        28: '7rem',
        32: '8rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
