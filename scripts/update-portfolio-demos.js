#!/usr/bin/env node

/**
 * Update Portfolio Demos
 * Updates the main index.html with demo sections from the demo management system
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PortfolioDemoUpdater {
  constructor() {
    this.demoIndexPath = path.join(__dirname, '../demos.json');
    this.indexHtmlPath = path.join(__dirname, '../index.html');
    this.demos = [];
  }

  /**
   * Initialize the updater
   */
  async init() {
    console.log(chalk.blue('🔄 Updating portfolio demos...'));
    
    // Load demo sections
    await this.loadDemoSections();
    
    // Update index.html
    await this.updateIndexHtml();
    
    console.log(chalk.green('✅ Portfolio demos updated successfully'));
  }

  /**
   * Load demo sections from demos.json
   */
  async loadDemoSections() {
    try {
      if (!fs.existsSync(this.demoIndexPath)) {
        console.log(chalk.yellow('No demos.json found. Creating initial demo structure...'));
        await this.createInitialDemos();
      }

      const data = fs.readFileSync(this.demoIndexPath, 'utf8');
      const demoData = JSON.parse(data);
      this.demos = demoData.sections || [];
      
      console.log(chalk.green(`Loaded ${this.demos.length} demo sections`));
    } catch (error) {
      console.error(chalk.red('Error loading demo sections:'), error);
      throw error;
    }
  }

  /**
   * Create initial demos.json if it doesn't exist
   */
  async createInitialDemos() {
    const DemoSectionManager = require('./demo-section-manager');
    const manager = new DemoSectionManager();
    await manager.init();
    this.demos = manager.sections;
  }

  /**
   * Update the main index.html with demo sections
   */
  async updateIndexHtml() {
    try {
      let indexHtml = fs.readFileSync(this.indexHtmlPath, 'utf8');
      
      // Generate demo sections HTML
      const demoSectionsHtml = this.generateDemoSectionsHtml();
      
      // Find and replace the demo section in index.html
      const demoSectionRegex = /<!-- Live Demos Section -->[\s\S]*?<\/section>/;
      const newDemoSection = `<!-- Live Demos Section -->${demoSectionsHtml}</section>`;
      
      if (demoSectionRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(demoSectionRegex, newDemoSection);
      } else {
        console.log(chalk.yellow('Could not find demo section in index.html. Appending to body...'));
        // If we can't find the section, append it before the closing body tag
        indexHtml = indexHtml.replace('</main>', `${newDemoSection}\n  </main>`);
      }
      
      // Write updated index.html
      fs.writeFileSync(this.indexHtmlPath, indexHtml);
      
      console.log(chalk.green('Updated index.html with demo sections'));
    } catch (error) {
      console.error(chalk.red('Error updating index.html:'), error);
      throw error;
    }
  }

  /**
   * Generate HTML for demo sections
   */
  generateDemoSectionsHtml() {
    if (this.demos.length === 0) {
      return `
    <section id="demos" class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Live Demos
          </h2>
          <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Interactive demos of my projects and experiments
          </p>
        </div>
        
        <div class="mt-12 text-center">
          <p class="text-gray-500 dark:text-gray-400">No demos available yet. Check back soon!</p>
        </div>
      </div>
    </section>`;
    }

    const featuredDemos = this.demos.filter(demo => demo.featured && demo.status === 'active');
    const activeDemos = this.demos.filter(demo => demo.status === 'active');
    
    return `
    <section id="demos" class="py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Live Demos
          </h2>
          <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Interactive demos of my projects and experiments
          </p>
        </div>
        
        <div class="mt-12 grid gap-8 md:grid-cols-2">
          ${activeDemos.map(demo => this.generateDemoCardHtml(demo)).join('')}
        </div>
        
        ${activeDemos.length > 2 ? `
        <div class="mt-12 text-center">
          <a href="generated-demos/index.html" class="btn btn-primary">
            View All Demos
          </a>
        </div>
        ` : ''}
      </div>
    </section>`;
  }

  /**
   * Generate HTML for a single demo card
   */
  generateDemoCardHtml(demo) {
    const embedContent = demo.embedUrl
      ? `<div class="bg-gray-200 dark:bg-gray-700 rounded-md mb-4 overflow-hidden" style="height: 600px;">
          <iframe
            src="${demo.embedUrl}"
            class="w-full h-full border-0"
            allowfullscreen
            loading="lazy"
            title="${demo.title}">
          </iframe>
        </div>`
      : `<div class="bg-gray-200 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center" style="height: 500px;">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Demo Embed</p>
            ${demo.embedUrl ? '' : '<p class="text-sm text-gray-400 dark:text-gray-500">Embed URL not configured</p>'}
          </div>
        </div>`;

    const techBadges = demo.technologies.map(tech => 
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
        ${tech}
      </span>`
    ).join(' ');

    const fullscreenLink = demo.fullscreenUrl || demo.embedUrl
      ? `<a href="${demo.fullscreenUrl || demo.embedUrl}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          Full Screen
        </a>`
      : '';

    // Generate status badge
    const statusBadge = this.generateStatusBadge(demo.status);

    return `
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">${demo.title}</h3>
                ${statusBadge}
              </div>
              <p class="text-base text-gray-500 dark:text-gray-400 mb-4">
                ${demo.description}
              </p>
              
              ${embedContent}
              
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div class="flex flex-wrap gap-2">
                  ${techBadges}
                </div>
                ${fullscreenLink}
              </div>
            </div>
          </div>`;
  }

  /**
   * Generate status badge HTML
   */
  generateStatusBadge(status) {
    switch(status) {
      case 'active':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          🟢 Active
        </span>`;
      case 'in-progress':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          🟡 In Progress
        </span>`;
      case 'inactive':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          🔴 Inactive
        </span>`;
      default:
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          ⚪ ${status}
        </span>`;
    }
  }
}

module.exports = PortfolioDemoUpdater;

// CLI functionality
if (require.main === module) {
  const updater = new PortfolioDemoUpdater();
  
  updater.init().then(() => {
    console.log(chalk.green('\n🎉 Portfolio demos updated successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Start your dev server: npm run dev');
    console.log('2. Navigate to the demos section');
    console.log('3. Your new demos should appear on the main page');
  }).catch(error => {
    console.error(chalk.red('Error updating portfolio demos:'), error.message);
    process.exit(1);
  });
}