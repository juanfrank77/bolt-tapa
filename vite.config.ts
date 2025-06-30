import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    proxy: {
      '/api/creem': {
        target: 'https://test-api.creem.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/creem/, '')
      }
    }
  }
});
