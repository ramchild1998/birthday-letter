import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true,
    }),
  ],
  define: {
    // Safely expose process.env.API_KEY
    'process.env': JSON.stringify({
      API_KEY: process.env['API_KEY'] || '',
    }),
  },
  resolve: {
    mainFields: ['module'],
  },
});