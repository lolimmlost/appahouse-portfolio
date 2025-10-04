#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AppaHouse Portfolio...');

// Function to execute a command and handle errors
function runCommand(command, errorMessage) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ ${errorMessage}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Check if package.json exists
if (!fileExists('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Install NPM dependencies
console.log('📦 Installing NPM dependencies...');
runCommand('npm install', 'Failed to install NPM dependencies.');

// Create CSS output directory if it doesn't exist
const cssDir = path.join(__dirname, 'css');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

// Build Tailwind CSS
console.log('🎨 Building Tailwind CSS...');
runCommand('npm run build', 'Failed to build Tailwind CSS.');

console.log('✅ Setup completed successfully!');
console.log('');
console.log('To start development:');
console.log('  npm run dev');
console.log('');
console.log('To build for production:');
console.log('  npm run build');
console.log('');
console.log('🌐 Open index.html in your browser to view the portfolio.');