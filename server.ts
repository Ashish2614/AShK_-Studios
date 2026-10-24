import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './src/serverApp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPort(): number {
  const portIdx = process.argv.indexOf('--port');
  if (portIdx !== -1 && process.argv[portIdx + 1]) {
    return parseInt(process.argv[portIdx + 1], 10);
  }
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}

function getHost(): string {
  const hostIdx = process.argv.indexOf('--host');
  if (hostIdx !== -1 && process.argv[hostIdx + 1]) {
    return process.argv[hostIdx + 1];
  }
  return '0.0.0.0';
}

const PORT = getPort();
const HOST = getHost();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ---------------------------------------------------------------------
// Server / Vite Middleware Initialization
// ---------------------------------------------------------------------
async function startServer() {
  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(app.get('express.static') || (await import('express')).default.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`AShK Stays server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

export default app;
