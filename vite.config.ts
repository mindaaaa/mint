import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './src/app/transport/web',
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './dist/core'),
      '@app': path.resolve(__dirname, './dist/app'),
      '@web': path.resolve(__dirname, './src/app/transport/web'),
    },
  },
  server: {
    port: 3000,
  },
});
