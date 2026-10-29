/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#060608',
        charcoal: '#0E0F12',
        surface: {
          DEFAULT: '#14161B',
          hover: '#1A1D24',
          elevated: '#20242D',
        },
        volt: {
          DEFAULT: '#F43F5E',
          dim: 'rgba(225, 29, 72, 0.16)',
        },
        frost: {
          DEFAULT: '#EDF2F7',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['"Archivo"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      maxWidth: {
        container: '1360px',
      },
    },
  },
  plugins: [],
};
