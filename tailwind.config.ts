import type { Config } from 'tailwindcss';

export default {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
    './renderer/providers/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
} satisfies Config;
