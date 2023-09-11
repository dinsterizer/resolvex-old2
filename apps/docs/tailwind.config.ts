import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import scrollbarPlugin from 'tailwind-scrollbar'
import containerQueriesPlugin from '@tailwindcss/container-queries'

// @ts-expect-error - no types
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

export default <Partial<Config>> {
  content: [
    'src/**/*.*',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        title: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
    iconsPlugin({
      collections: getIconCollections(['heroicons', 'mdi']),
    }),
    containerQueriesPlugin,
  ],
}
