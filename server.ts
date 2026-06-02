import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAssistantRequest } from './src/api/assistant.js';

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure header security
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint for SportRes AI Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await handleAssistantRequest(req.body, apiKey);
    res.json(response);
  } catch (error: any) {
    console.error('Server side error handling assistant request:', error);
    res.status(500).json({
      success: false,
      text: 'Đã xảy ra lỗi hệ thống khi liên hệ trợ lý ảo.',
      error: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for Single Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SportRes API Server] Listening on http://localhost:${PORT}`);
});
