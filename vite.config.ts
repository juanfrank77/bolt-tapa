import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  // Remove the proxy configuration since we're now using Supabase Edge Functions
  // The proxy was only for development and doesn't work in production
});