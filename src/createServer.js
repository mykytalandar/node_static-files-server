'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function sendText(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  const FILE = '/file/';

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const pathname = url.pathname; // /file/styles/main.css

    if (pathname.includes('//')) {
      return sendText(res, 404, 'Not found');
    }

    if (pathname.includes('../')) {
      return sendText(res, 400, 'Bad request');
    }

    if (!pathname.startsWith(FILE) || pathname === '/file') {
      return sendText(res, 200, `Use ${FILE}<path>`);
    }

    const fileLength = FILE.length;

    let requestedPath = pathname.slice(fileLength);

    if (pathname === FILE) {
      requestedPath = 'index.html';
    }

    const realPath = path.join(__dirname, 'public', requestedPath);

    try {
      const file = await fs.readFile(realPath, 'utf-8');

      res.statusCode = 200;

      if (realPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else {
        res.setHeader('Content-Type', 'text/html');
      }
      res.end(file);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
