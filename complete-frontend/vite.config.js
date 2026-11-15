import reactRefresh from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://vybe-ijp0.onrender.com',
        changeOrigin: true,
        cookieRewrite: true,
      },
    },
  },
});
