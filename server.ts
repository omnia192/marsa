import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './src/main.server';
import 'localstorage-polyfill';
import axios from 'axios';

global.localStorage = localStorage;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/marsa-project/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index.html';

  // Initialize the Angular SSR engine
  const engine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // Point of serving robots.txt from the server
  server.get('/robots.txt', async (req, res) => {
    try {
      const seoData = await axios.get('https://admin.marsawaves.org/api/seo');
      const robotsUrl = seoData.data.seo.robots;
      console.log(robotsUrl);
      const robotsResponse = await axios.get(robotsUrl);
      res.setHeader('Content-Type', 'text/plain');
      res.send(robotsResponse.data);
    } catch (error) {
      res.status(500).send('Error fetching robots.txt');
    }
  });

  // Point of serving sitemap.xml from the server
  server.get('/sitemap.xml', async (req, res) => {
    try {
      const seoData = await axios.get('https://admin.marsawaves.org/api/seo');
      const sitemapUrl = seoData.data.seo.sitemap;
      console.log(seoData);
      const sitemapResponse = await axios.get(sitemapUrl);
      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemapResponse.data);
    } catch (error) {
      res.status(500).send('Error fetching sitemap.xml');
    }
  });

  // All regular routes use the Universal engine
  server.get('*', async (req, res) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    try {
      const html = await engine.render({
        bootstrap,
        documentFilePath: join(distFolder, indexHtml),
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      });

      res.send(html);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
