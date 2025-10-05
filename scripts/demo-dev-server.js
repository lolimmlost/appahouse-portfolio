#!/usr/bin/env node

/**
 * Demo Development Server
 * A simple development server for demos with proper CORS headers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const chalk = require('chalk');

class DemoDevServer {
  constructor(port = 3001) {
    this.port = port;
    this.mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm'
    };
  }

  /**
   * Start the development server
   */
  start() {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(this.port, () => {
      console.log(chalk.green(`🚀 Demo development server running at http://localhost:${this.port}`));
      console.log(chalk.blue('📝 Use this URL for your demo embed:'));
      console.log(chalk.cyan(`   http://localhost:${this.port}/your-demo.html`));
      console.log(chalk.yellow('\n💡 CORS is enabled for local development'));
      console.log(chalk.gray('   Press Ctrl+C to stop the server'));
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Shutting down demo development server...'));
      server.close(() => {
        console.log(chalk.green('✅ Server stopped'));
        process.exit(0);
      });
    });
  }

  /**
   * Handle incoming requests
   */
  handleRequest(req, res) {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Default to index.html for root path
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Construct file path
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(process.cwd(), safePath);

    // Try to serve the file
    this.serveFile(filePath, res);
  }

  /**
   * Serve a file
   */
  serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // File not found, try to serve a 404 page
        this.serve404(res);
        return;
      }

      const ext = path.extname(filePath);
      const contentType = this.mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      });
      res.end(data);
    });
  }

  /**
   * Serve a 404 page
   */
  serve404(res) {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Demo Not Found</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #e74c3c; }
          p { color: #555; line-height: 1.6; }
          a { color: #3498db; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404 - Demo Not Found</h1>
          <p>The demo you're looking for doesn't exist or has been moved.</p>
          <p><a href="/">Go to Demo Index</a></p>
        </div>
      </body>
      </html>
    `);
  }
}

// CLI functionality
if (require.main === module) {
  const port = process.argv[2] ? parseInt(process.argv[2]) : 3001;
  
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error(chalk.red('Invalid port number. Please provide a port between 1 and 65535.'));
    process.exit(1);
  }

  const server = new DemoDevServer(port);
  server.start();
}

module.exports = DemoDevServer;