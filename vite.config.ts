import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true,
    }),
  ],
  define: {
    // We define the entire process.env object to support "process.env['API_KEY']" syntax safely
    'process.env': JSON.stringify({
      API_KEY: process.env['API_KEY'] || '',
    }),
  },
  resolve: {
    mainFields: ['module'],
  },
});