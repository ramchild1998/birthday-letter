import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true, // Enable JIT mode since the app imports @angular/compiler manually
    }),
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env['API_KEY'] || ''),
  },
  resolve: {
    mainFields: ['module'],
  },
});