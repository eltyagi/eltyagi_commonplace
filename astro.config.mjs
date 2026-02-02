import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://eltyagi.xyz',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    ssr: {
      noExternal: ['react-router-dom']
    }
  }
});
