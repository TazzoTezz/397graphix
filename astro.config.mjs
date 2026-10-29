import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://397graphix.co.nz',
  integrations: [tailwind({ applyBaseStyles: false })],
  build: {
    format: 'file',
  },
});

