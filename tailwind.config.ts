import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1c1c1c',
        gold: '#C9A84C',
      },
    },
  },
  plugins: [],
}

export default config
