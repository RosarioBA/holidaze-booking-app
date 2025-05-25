import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/holidaze-booking-app/', // Your actual repository name
  server: {
    proxy: {
      '/api': {
        target: 'https://v2.api.noroff.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});