import { defineConfig } from 'astro/config';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  site: 'https://397graphix.co.nz',
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
  build: {
    format: 'directory',
  },
});
