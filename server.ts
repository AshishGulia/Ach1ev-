import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { attachApiRoutes } from './server/app.js';

const envFiles = ['.env.local', '.env'].filter((file) =>
  fs.existsSync(path.resolve(process.cwd(), file))
);
if (envFiles.length > 0) {
  dotenv.config({ path: envFiles });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

attachApiRoutes(app);

// Setup Vite middleware in dev, or serve static dist in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Ach1ev Server running on http://localhost:${PORT} and http://0.0.0.0:${PORT}`);
  });
}

startServer();
