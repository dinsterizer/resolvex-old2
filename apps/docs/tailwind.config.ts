import containerQueriesPlugin from '@tailwindcss/container-queries'
import scrollbarPlugin from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['src/**/*.*'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        title: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [scrollbarPlugin({ nocompatible: true }), containerQueriesPlugin],
} satisfies Partial<Config>
