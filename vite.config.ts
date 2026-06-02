import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';
import { handleAssistantRequest } from './src/api/assistant';

// Load environment for development APIs
dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/assistant') && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  res.setHeader('Content-Type', 'application/json');
                  const parsedBody = JSON.parse(body);
                  const result = await handleAssistantRequest(parsedBody, process.env.GEMINI_API_KEY);
                  res.end(JSON.stringify(result));
                } catch (error: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: error.message }));
                }
              });
              return;
            }
            if (req.url && req.url.startsWith('/api/health') && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'ok', environment: 'vite-dev' }));
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
