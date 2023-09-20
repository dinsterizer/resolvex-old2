import containerQueriesPlugin from '@tailwindcss/container-queries'
import scrollbarPlugin from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: ['class'],
  content: ['src/**/*.*'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        title: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [scrollbarPlugin({ nocompatible: true }), containerQueriesPlugin, animatePlugin],
} satisfies Partial<Config>
