import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './src/app/transport/web',
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './dist/core'),
      '@app': path.resolve(__dirname, './dist/app'),
    },
  },
  server: {
    port: 3000,
  },
});
