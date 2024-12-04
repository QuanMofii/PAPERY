import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const host = process.env.HOST || '127.0.0.1';
const port = parseInt(process.env.PORT || '3000', 10);

// Load required server files dynamically
const requiredServerFilesPath = path.join(process.cwd(), '.next/required-server-files.json');

fs.readFile(requiredServerFilesPath, 'utf-8')
  .then(async (data) => {
    const { config } = JSON.parse(data);
    process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);

    const app = next({ dev });
    await app.prepare();

    const handle = app.getRequestHandler();

    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Enviroment: ${process.env.NODE_ENV}`);
      console.log(`> Server frontend ready on http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to load required-server-files.json:", error);
    process.exit(1);
  });