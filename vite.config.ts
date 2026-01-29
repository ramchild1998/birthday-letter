import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true, // Keeping JIT true for easier migration from the online editor
    }),
  ],
  define: {
    // Polyfill process.env so accessing API_KEY doesn't crash the app
    'process.env': JSON.stringify({
      API_KEY: process.env['API_KEY'] || '',
    }),
  },
  resolve: {
    mainFields: ['module'],
  },
});