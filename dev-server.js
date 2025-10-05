#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');

// Configuration
const PORT = 8000;
const HOST = '0.0.0.0';

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

// Function to determine the MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath);
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Function to serve files
function serveFile(filePath, response) {
  // Read the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, serve 404 page
      if (err.code === 'ENOENT') {
        console.log(`File not found: ${filePath}`);
        
        // Check if a custom 404 page exists
        fs.readFile(path.join(__dirname, '404.html'), (err404, data404) => {
          if (err404) {
            // If no custom 404 page, serve a simple 404 message
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('<html><body><h1>404 Not Found</h1><p>Page not found</p></body></html>');
          } else {
            // Serve custom 404 page
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(data404);
          }
        });
      } else {
        // Server error
        console.error(`Error serving file: ${err}`);
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end('<html><body><h1>500 Internal Server Error</h1><p>Sorry, something went wrong.</p></body></html>');
      }
    } else {
      // File found, serve it with appropriate MIME type
      const mimeType = getMimeType(filePath);
      response.writeHead(200, { 'Content-Type': mimeType });
      response.end(data);
    }
  });
}

// Create HTTP server
const server = http.createServer((request, response) => {
  // Parse the URL
  const parsedUrl = url.parse(request.url);
  let filePath = parsedUrl.pathname;
  
  // If URL is root, serve index.html
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }
  
  // Construct the full file path
  filePath = path.join(__dirname, filePath);
  
  // Get the file extension
  const ext = path.extname(filePath);
  
  // If the file has no extension and is not a directory, try adding .html
  if (!ext && !fs.existsSync(filePath)) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    }
  }
  
  // Serve the file
  serveFile(filePath, response);
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Development server running at http://${HOST}:${PORT}/\n`);
  console.log(`📁 Serving files from: ${__dirname}\n`);
  
  // Get local IP address for LAN access
  const interfaces = os.networkInterfaces();
  let localIP = null;
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        localIP = interface.address;
        break;
      }
    }
    if (localIP) break;
  }
  
  if (localIP) {
    console.log(`🌐 LAN access: http://${localIP}:${PORT}/\n`);
  }
  
  console.log('Press Ctrl+C to stop the server\n');
  
  // Open the browser automatically with localhost
  const open = process.platform === 'darwin' ? 'open' :
               process.platform === 'win32' ? 'start' : 'xdg-open';
  
  require('child_process').exec(`${open} http://localhost:${PORT}/`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Development server stopped\n');
  process.exit(0);
});