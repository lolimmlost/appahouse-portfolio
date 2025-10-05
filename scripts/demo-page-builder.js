#!/usr/bin/env node

/**
 * Demo Page Builder
 * Handles assembling demo pages from sections and generating HTML
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class DemoPageBuilder {
  constructor() {
    this.demoSectionsPath = path.join(__dirname, '../demos');
    this.demoIndexPath = path.join(__dirname, '../demos.json');
    this.templatesPath = path.join(__dirname, '../templates/demo-sections');
    this.outputPath = path.join(__dirname, '../generated-demos');
    this.sections = [];
  }

  /**
   * Initialize the demo page builder
   */
  async init() {
    console.log(chalk.blue('🏗️  Initializing Demo Page Builder...'));
    
    // Create output directory
    await this.ensureOutputDirectory();
    
    // Load demo sections
    await this.loadDemoSections();
    
    console.log(chalk.green('✅ Demo Page Builder initialized successfully'));
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
      console.log(chalk.gray(`Created output directory: ${this.outputPath}`));
    }
  }

  /**
   * Load demo sections from the demos index
   */
  async loadDemoSections() {
    try {
      if (fs.existsSync(this.demoIndexPath)) {
        const data = fs.readFileSync(this.demoIndexPath, 'utf8');
        const demoData = JSON.parse(data);
        this.sections = demoData.sections || [];
      } else {
        console.warn(chalk.yellow('Warning: demos.json not found. Please run demo-section-manager first.'));
        this.sections = [];
      }
      
      console.log(chalk.green(`Loaded ${this.sections.length} demo sections`));
    } catch (error) {
      console.error(chalk.red('Error loading demo sections:'), error);
      throw error;
    }
  }

  /**
   * Build a demo page from sections
   */
  async buildDemoPage(options = {}) {
    const {
      title = 'Demo Page',
      description = 'Interactive demos and experiments',
      sections = this.getFeaturedSections(),
      layout = 'grid',
      theme = 'default'
    } = options;

    console.log(chalk.blue(`🔨 Building demo page: ${title}`));

    // Generate HTML
    const html = this.generateDemoPageHTML({
      title,
      description,
      sections,
      layout,
      theme
    });

    // Save to file
    const fileName = this.generateFileName(title);
    const filePath = path.join(this.outputPath, fileName);
    
    fs.writeFileSync(filePath, html);
    
    console.log(chalk.green(`✅ Demo page built: ${filePath}`));
    return filePath;
  }

  /**
   * Get featured sections
   */
  getFeaturedSections() {
    return this.sections.filter(section => section.featured && section.status === 'active');
  }

  /**
   * Generate file name from title
   */
  generateFileName(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '.html';
  }

  /**
   * Generate demo page HTML
   */
  generateDemoPageHTML(options) {
    const { title, description, sections, layout, theme } = options;
    
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - AppaHouse Portfolio</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="../css/output.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    .demo-embed {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 0.5rem;
    }
    .demo-embed iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    .demo-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      min-height: 300px;
      border-radius: 0.5rem;
    }
    .demo-grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
    .demo-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .demo-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s ease;
    }
    .demo-card:hover {
      transform: translateY(-2px);
    }
    .dark .demo-card {
      background: #1f2937;
    }
    .tech-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #dbeafe;
      color: #1e40af;
    }
    .dark .tech-badge {
      background: #1e3a8a;
      color: #dbeafe;
    }
  </style>
</head>
<body class="font-sans antialiased bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <a href="../index.html" class="text-xl font-bold text-primary-600 dark:text-primary-400">AppaHouse</a>
        </div>
        
        <nav class="hidden md:flex md:items-center md:space-x-6">
          <a href="../index.html#home" class="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Home</a>
          <a href="../index.html#projects" class="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Projects</a>
          <a href="../index.html#demos" class="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Demos</a>
          <a href="../index.html#contact" class="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">Contact</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          ${title}
        </h1>
        <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
          ${description}
        </p>
      </div>

      <!-- Demo Sections -->
      <div class="demo-${layout}">
        ${sections.map(section => this.generateDemoSectionHTML(section)).join('')}
      </div>

      ${sections.length === 0 ? `
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Demos Available</h3>
          <p class="text-gray-500 dark:text-gray-400">Check back later for new demos and experiments.</p>
        </div>
      ` : ''}
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p>&copy; 2025 AppaHouse. All rights reserved.</p>
        <div class="mt-4 flex justify-center space-x-4">
          <a href="../index.html" class="text-gray-400 hover:text-white">Back to Portfolio</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- JavaScript -->
  <script src="../js/main.js"></script>
  <script src="../js/dark-mode.js"></script>
  <script>
    // Initialize dark mode
    document.addEventListener('DOMContentLoaded', function() {
      // Dark mode toggle functionality
      const darkModeToggle = document.getElementById('dark-mode-toggle');
      if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
          document.documentElement.classList.toggle('dark');
          localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
      }

      // Load dark mode preference
      if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
      }
    });
  </script>
</body>
</html>`;
  }

  /**
   * Generate HTML for a single demo section
   */
  generateDemoSectionHTML(section) {
    const embedContent = section.embedUrl 
      ? `<div class="demo-embed">
          <iframe src="${section.embedUrl}" allowfullscreen></iframe>
        </div>`
      : `<div class="demo-placeholder">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p>Demo Embed</p>
            <p class="text-sm opacity-75">Embed URL not configured</p>
          </div>
        </div>`;

    const techBadges = section.technologies.map(tech => 
      `<span class="tech-badge">${tech}</span>`
    ).join(' ');

    const fullscreenLink = section.fullscreenUrl || section.embedUrl
      ? `<a href="${section.fullscreenUrl || section.embedUrl}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          Full Screen
        </a>`
      : '';

    return `
      <div class="demo-card">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">${section.title}</h3>
          <p class="text-base text-gray-500 dark:text-gray-400 mb-4">
            ${section.description}
          </p>
          
          ${embedContent}
          
          <div class="flex justify-between items-center mt-4">
            <div class="flex space-x-2">
              ${techBadges}
            </div>
            ${fullscreenLink}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build all demo pages
   */
  async buildAllDemoPages() {
    console.log(chalk.blue('🏗️  Building all demo pages...'));

    // Build featured demos page
    await this.buildDemoPage({
      title: 'Featured Demos',
      description: 'Interactive demos of featured projects and experiments',
      sections: this.getFeaturedSections(),
      layout: 'grid'
    });

    // Build pages by category
    const categories = this.getCategories();
    for (const category of categories) {
      const categorySections = this.getSectionsByCategory(category);
      if (categorySections.length > 0) {
        await this.buildDemoPage({
          title: `${category} Demos`,
          description: `Interactive demos from the ${category} category`,
          sections: categorySections,
          layout: 'grid'
        });
      }
    }

    // Build all demos page
    await this.buildDemoPage({
      title: 'All Demos',
      description: 'Complete collection of interactive demos and experiments',
      sections: this.sections.filter(s => s.status === 'active'),
      layout: 'grid'
    });

    console.log(chalk.green('✅ All demo pages built successfully'));
  }

  /**
   * Get all categories
   */
  getCategories() {
    const categories = new Set();
    this.sections.forEach(section => {
      if (section.category) {
        categories.add(section.category);
      }
    });
    return Array.from(categories);
  }

  /**
   * Get sections by category
   */
  getSectionsByCategory(category) {
    return this.sections.filter(section => 
      section.category === category && section.status === 'active'
    );
  }

  /**
   * Generate demo index page
   */
  async generateDemoIndex() {
    console.log(chalk.blue('📄 Generating demo index page...'));

    const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Index - AppaHouse Portfolio</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <meta name="description" content="Index of all available demo pages">
  <link rel="stylesheet" href="../css/output.css">
</head>
<body class="font-sans antialiased bg-gray-50 dark:bg-gray-900">
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Demo Pages</h1>
      
      <div class="grid gap-6 md:grid-cols-2">
        <a href="featured-demos.html" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Featured Demos</h2>
          <p class="text-gray-600 dark:text-gray-400">Interactive demos of featured projects and experiments</p>
        </a>
        
        <a href="all-demos.html" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">All Demos</h2>
          <p class="text-gray-600 dark:text-gray-400">Complete collection of interactive demos and experiments</p>
        </a>
        
        ${this.getCategories().map(category => `
          <a href="${this.generateFileName(category + ' Demos')}" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${category} Demos</h2>
            <p class="text-gray-600 dark:text-gray-400">Interactive demos from the ${category} category</p>
          </a>
        `).join('')}
      </div>
      
      <div class="mt-8 text-center">
        <a href="../index.html" class="btn btn-secondary">Back to Portfolio</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    const indexPath = path.join(this.outputPath, 'index.html');
    fs.writeFileSync(indexPath, html);
    
    console.log(chalk.green(`✅ Demo index page generated: ${indexPath}`));
    return indexPath;
  }
}

module.exports = DemoPageBuilder;

// CLI functionality
if (require.main === module) {
  const builder = new DemoPageBuilder();
  
  builder.init().then(() => {
    const command = process.argv[2];
    
    switch (command) {
      case 'build':
        buildInteractiveDemo();
        break;
      case 'build-all':
        builder.buildAllDemoPages().then(() => {
          return builder.generateDemoIndex();
        }).then(() => {
          console.log(chalk.green('All demo pages built successfully'));
        }).catch(error => {
          console.error(chalk.red('Error building demo pages:'), error.message);
          process.exit(1);
        });
        break;
      case 'index':
        builder.generateDemoIndex().then(() => {
          console.log(chalk.green('Demo index page generated successfully'));
        }).catch(error => {
          console.error(chalk.red('Error generating demo index:'), error.message);
          process.exit(1);
        });
        break;
      default:
        console.log(chalk.blue('Available commands:'));
        console.log('  build      - Build a demo page interactively');
        console.log('  build-all  - Build all demo pages (featured, by category, all)');
        console.log('  index      - Generate demo index page');
    }
  }).catch(error => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
  
  async function buildInteractiveDemo() {
    const readline = require('readline');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };
    
    console.log(chalk.blue('\n🏗️  Build Demo Page\n'));
    
    try {
      // Get page options
      const title = await question('Page title (Featured Demos): ') || 'Featured Demos';
      const description = await question('Page description (Interactive demos of featured projects and experiments): ') || 'Interactive demos of featured projects and experiments';
      
      console.log(chalk.gray('\nAvailable layouts:'));
      console.log('  grid - Grid layout (default)');
      console.log('  list - List layout');
      const layout = await question('Layout (grid): ') || 'grid';
      
      console.log(chalk.gray('\nAvailable sections:'));
      builder.sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (${section.category}) - ID: ${section.id}`);
      });
      
      const sectionIdsInput = await question('Section IDs to include (comma-separated, or leave empty for featured): ');
      let sections;
      
      if (sectionIdsInput.trim()) {
        const sectionIds = sectionIdsInput.split(',').map(id => id.trim());
        sections = builder.sections.filter(s => sectionIds.includes(s.id));
      } else {
        sections = builder.getFeaturedSections();
      }
      
      if (sections.length === 0) {
        console.log(chalk.yellow('No sections found. Building with featured sections...'));
        sections = builder.getFeaturedSections();
      }
      
      console.log(chalk.blue(`\nBuilding page with ${sections.length} sections...`));
      
      // Build the page
      await builder.buildDemoPage({
        title,
        description,
        sections,
        layout
      });
      
      console.log(chalk.green('\n✅ Demo page built successfully!'));
      console.log(chalk.blue('\nNext steps:'));
      console.log('1. Check the generated-demos directory for your new page');
      console.log('2. Open the page in your browser to test');
      
    } catch (error) {
      console.error(chalk.red('Error building demo page:'), error.message);
    }
    
    rl.close();
  }
}