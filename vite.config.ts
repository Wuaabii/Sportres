import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.API_DEV_URL || 'http://127.0.0.1:3001',
          changeOrigin: true,
          configure(proxy) {
            proxy.on('error', (error, req) => {
              console.error('[Vite API proxy]', {
                endpoint: req.url,
                target: process.env.API_DEV_URL || 'http://127.0.0.1:3001',
                error: error.message,
              });
            });
          },
        },
      },
      strictPort: true,
      // HMR can be disabled via the DISABLE_HMR environment variable.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
