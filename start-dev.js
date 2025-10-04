#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AppaHouse Portfolio development environment...\n');

// Start Tailwind CSS compilation in watch mode
console.log('🎨 Starting Tailwind CSS compilation...');
const cssProcess = spawn('npm', ['run', 'build:css'], {
  stdio: 'inherit',
  shell: true
});

// Start the development server after a short delay
setTimeout(() => {
  console.log('\n🌐 Starting development server...\n');
  const serverProcess = spawn('node', [path.join(__dirname, 'dev-server.js')], {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping development environment...\n');
    cssProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
}, 1000);