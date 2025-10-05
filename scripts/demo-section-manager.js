#!/usr/bin/env node

/**
 * Demo Section Manager
 * Handles loading, organizing, and managing demo sections for the portfolio
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class DemoSectionManager {
  constructor() {
    this.demoSectionsPath = path.join(__dirname, '../demos');
    this.demoIndexPath = path.join(__dirname, '../demos.json');
    this.templatesPath = path.join(__dirname, '../templates/demo-sections');
    this.sections = [];
    this.categories = new Set();
  }

  /**
   * Initialize the demo section manager
   */
  async init() {
    console.log(chalk.blue('🎬 Initializing Demo Section Manager...'));
    
    // Create necessary directories
    await this.ensureDirectories();
    
    // Load existing demo sections
    await this.loadDemoSections();
    
    console.log(chalk.green('✅ Demo Section Manager initialized successfully'));
  }

  /**
   * Ensure necessary directories exist
   */
  async ensureDirectories() {
    const dirs = [
      this.demoSectionsPath,
      this.templatesPath,
      path.join(this.demoSectionsPath, 'assets')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(chalk.gray(`Created directory: ${dir}`));
      }
    }
  }

  /**
   * Load all demo sections from the demos directory
   */
  async loadDemoSections() {
    try {
      // Check if demos.json exists
      if (fs.existsSync(this.demoIndexPath)) {
        const data = fs.readFileSync(this.demoIndexPath, 'utf8');
        const demoData = JSON.parse(data);
        this.sections = demoData.sections || [];
      } else {
        // Create initial demos.json if it doesn't exist
        await this.createInitialDemoIndex();
      }

      // Load individual demo files
      await this.loadIndividualDemos();
      
      // Extract categories
      this.extractCategories();
      
      console.log(chalk.green(`Loaded ${this.sections.length} demo sections`));
    } catch (error) {
      console.error(chalk.red('Error loading demo sections:'), error);
      throw error;
    }
  }

  /**
   * Create initial demos.json file
   */
  async createInitialDemoIndex() {
    const initialData = {
      sections: [
        {
          id: 'florist-website-demo',
          title: 'Florist Website Demo',
          description: 'Explore the custom website built for Indigo Sun Florals with online ordering capabilities.',
          category: 'E-commerce',
          technologies: ['Tanstack Start', 'Docker'],
          embedUrl: '',
          fullscreenUrl: '',
          thumbnail: '/assets/images/florist-demo-thumb.jpg',
          featured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'task-management-app-demo',
          title: 'Task Management App Demo',
          description: 'Experience real-time collaboration in our task management application.',
          category: 'Productivity',
          technologies: ['Tanstack Start', 'WebSocket'],
          embedUrl: '',
          fullscreenUrl: '',
          thumbnail: '/assets/images/task-app-demo-thumb.jpg',
          featured: true,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      categories: ['E-commerce', 'Productivity'],
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(this.demoIndexPath, JSON.stringify(initialData, null, 2));
    this.sections = initialData.sections;
    
    console.log(chalk.green('Created initial demos.json file'));
  }

  /**
   * Load individual demo files from the demos directory
   */
  async loadIndividualDemos() {
    if (!fs.existsSync(this.demoSectionsPath)) {
      return;
    }

    const files = fs.readdirSync(this.demoSectionsPath);
    const demoFiles = files.filter(file => file.endsWith('.json'));

    for (const file of demoFiles) {
      try {
        const filePath = path.join(this.demoSectionsPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const demoSection = JSON.parse(data);
        
        // Update or add the demo section
        const existingIndex = this.sections.findIndex(s => s.id === demoSection.id);
        if (existingIndex >= 0) {
          this.sections[existingIndex] = { ...this.sections[existingIndex], ...demoSection };
        } else {
          this.sections.push(demoSection);
        }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not load demo file ${file}:`), error.message);
      }
    }
  }

  /**
   * Extract categories from demo sections
   */
  extractCategories() {
    this.categories = new Set();
    this.sections.forEach(section => {
      if (section.category) {
        this.categories.add(section.category);
      }
    });
  }

  /**
   * Create a new demo section
   */
  async createDemoSection(options) {
    const {
      title,
      description,
      category,
      technologies,
      embedUrl,
      fullscreenUrl,
      thumbnail,
      featured = false
    } = options;

    // Generate ID from title
    const id = this.generateId(title);

    // Validate required fields
    if (!title || !description || !category) {
      throw new Error('Title, description, and category are required');
    }

    // Create demo section object
    const demoSection = {
      id,
      title,
      description,
      category,
      technologies: technologies || [],
      embedUrl: embedUrl || '',
      fullscreenUrl: fullscreenUrl || '',
      thumbnail: thumbnail || '',
      featured,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to sections array
    this.sections.push(demoSection);
    this.categories.add(category);

    // Save to individual file
    await this.saveDemoSection(demoSection);

    // Update index
    await this.updateDemoIndex();

    console.log(chalk.green(`✅ Created demo section: ${title}`));
    return demoSection;
  }

  /**
   * Generate ID from title
   */
  generateId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Save demo section to individual file
   */
  async saveDemoSection(demoSection) {
    const filePath = path.join(this.demoSectionsPath, `${demoSection.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(demoSection, null, 2));
  }

  /**
   * Update the main demos.json index
   */
  async updateDemoIndex() {
    const indexData = {
      sections: this.sections,
      categories: Array.from(this.categories),
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(this.demoIndexPath, JSON.stringify(indexData, null, 2));
  }

  /**
   * Update an existing demo section
   */
  async updateDemoSection(id, updates) {
    const index = this.sections.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Demo section with ID '${id}' not found`);
    }

    // Update the section
    this.sections[index] = {
      ...this.sections[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update category if changed
    if (updates.category) {
      this.categories.add(updates.category);
    }

    // Save to individual file
    await this.saveDemoSection(this.sections[index]);

    // Update index
    await this.updateDemoIndex();

    console.log(chalk.green(`✅ Updated demo section: ${this.sections[index].title}`));
    return this.sections[index];
  }

  /**
   * Delete a demo section
   */
  async deleteDemoSection(id) {
    const index = this.sections.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Demo section with ID '${id}' not found`);
    }

    const section = this.sections[index];

    // Remove from sections array
    this.sections.splice(index, 1);

    // Delete individual file
    const filePath = path.join(this.demoSectionsPath, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update index
    await this.updateDemoIndex();

    // Re-extract categories
    this.extractCategories();

    console.log(chalk.green(`✅ Deleted demo section: ${section.title}`));
    return section;
  }

  /**
   * List all demo sections
   */
  listDemoSections() {
    console.log(chalk.blue('\n📋 Demo Sections:\n'));
    
    if (this.sections.length === 0) {
      console.log(chalk.yellow('No demo sections found.'));
      return;
    }

    this.sections.forEach((section, index) => {
      const status = section.status === 'active' ? '🟢' : '🔴';
      const featured = section.featured ? '⭐' : '  ';
      const techs = section.technologies.length > 0 ? section.technologies.slice(0, 3).join(', ') : 'None';
      
      console.log(`${index + 1}. ${status} ${featured} ${chalk.bold(section.title)}`);
      console.log(`   ID: ${section.id}`);
      console.log(`   Category: ${section.category}`);
      console.log(`   Technologies: ${techs}`);
      console.log(`   Featured: ${section.featured ? 'Yes' : 'No'}`);
      console.log(`   Status: ${section.status}`);
      console.log(`   Created: ${new Date(section.createdAt).toLocaleDateString()}`);
      console.log('');
    });
  }

  /**
   * Get demo sections by category
   */
  getDemoSectionsByCategory(category) {
    return this.sections.filter(section => section.category === category);
  }

  /**
   * Get featured demo sections
   */
  getFeaturedDemoSections() {
    return this.sections.filter(section => section.featured && section.status === 'active');
  }

  /**
   * Get all categories
   */
  getCategories() {
    return Array.from(this.categories);
  }

  /**
   * Validate demo section data
   */
  validateDemoSection(demoSection) {
    const errors = [];

    if (!demoSection.title || typeof demoSection.title !== 'string') {
      errors.push('Title is required and must be a string');
    }

    if (!demoSection.description || typeof demoSection.description !== 'string') {
      errors.push('Description is required and must be a string');
    }

    if (!demoSection.category || typeof demoSection.category !== 'string') {
      errors.push('Category is required and must be a string');
    }

    if (!Array.isArray(demoSection.technologies)) {
      errors.push('Technologies must be an array');
    }

    if (demoSection.embedUrl && typeof demoSection.embedUrl !== 'string') {
      errors.push('Embed URL must be a string');
    }

    if (demoSection.fullscreenUrl && typeof demoSection.fullscreenUrl !== 'string') {
      errors.push('Fullscreen URL must be a string');
    }

    if (demoSection.thumbnail && typeof demoSection.thumbnail !== 'string') {
      errors.push('Thumbnail must be a string');
    }

    return errors;
  }
}

module.exports = DemoSectionManager;

// CLI functionality
if (require.main === module) {
  const manager = new DemoSectionManager();
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
  
  manager.init().then(() => {
    const command = process.argv[2];
    
    switch (command) {
      case 'create':
        createInteractiveDemo();
        break;
      case 'list':
        manager.listDemoSections();
        rl.close();
        break;
      case 'categories':
        console.log(chalk.blue('\n📂 Categories:\n'));
        console.log(manager.getCategories().join(', '));
        rl.close();
        break;
      case 'featured':
        console.log(chalk.blue('\n⭐ Featured Demo Sections:\n'));
        const featured = manager.getFeaturedDemoSections();
        if (featured.length === 0) {
          console.log(chalk.yellow('No featured demo sections found.'));
        } else {
          featured.forEach(section => {
            console.log(`- ${section.title} (${section.category})`);
          });
        }
        rl.close();
        break;
      default:
        console.log(chalk.blue('Available commands:'));
        console.log('  create     - Create a new demo section interactively');
        console.log('  list       - List all demo sections');
        console.log('  categories - List all categories');
        console.log('  featured   - List featured demo sections');
        rl.close();
    }
  }).catch(error => {
    console.error(chalk.red('Error:'), error.message);
    rl.close();
    process.exit(1);
  });
  
  async function createInteractiveDemo() {
    console.log(chalk.blue('\n🎬 Create New Demo Section\n'));
    
    try {
      // Get demo details from user
      const title = await question('Demo title: ');
      if (!title.trim()) {
        console.log(chalk.red('Title is required'));
        rl.close();
        return;
      }
      
      const description = await question('Demo description: ');
      if (!description.trim()) {
        console.log(chalk.red('Description is required'));
        rl.close();
        return;
      }
      
      console.log(chalk.gray('\nExisting categories: ' + manager.getCategories().join(', ')));
      const category = await question('Category: ');
      if (!category.trim()) {
        console.log(chalk.red('Category is required'));
        rl.close();
        return;
      }
      
      const technologiesInput = await question('Technologies (comma-separated): ');
      const technologies = technologiesInput.split(',').map(t => t.trim()).filter(t => t);
      
      const embedUrl = await question('Embed URL (optional): ');
      const fullscreenUrl = await question('Fullscreen URL (optional): ');
      const thumbnail = await question('Thumbnail path (optional): ');
      
      const featuredInput = await question('Feature this demo? (y/N): ');
      const featured = featuredInput.toLowerCase() === 'y' || featuredInput.toLowerCase() === 'yes';
      
      // Create the demo section
      const demoSection = await manager.createDemoSection({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        technologies,
        embedUrl: embedUrl.trim(),
        fullscreenUrl: fullscreenUrl.trim(),
        thumbnail: thumbnail.trim(),
        featured
      });
      
      console.log(chalk.green('\n✅ Demo section created successfully!'));
      console.log(chalk.gray('\nDemo details:'));
      console.log(`  ID: ${demoSection.id}`);
      console.log(`  Title: ${demoSection.title}`);
      console.log(`  Category: ${demoSection.category}`);
      console.log(`  Technologies: ${demoSection.technologies.join(', ')}`);
      console.log(`  Featured: ${demoSection.featured ? 'Yes' : 'No'}`);
      
      console.log(chalk.blue('\nNext steps:'));
      console.log('1. Add your demo thumbnail to: ' + (demoSection.thumbnail || '/assets/images/'));
      console.log('2. Host your demo and update the embed URL');
      console.log('3. Build demo pages with: npm run demo:build-all');
      console.log('4. Validate with: npm run demo:validate:all');
      
    } catch (error) {
      console.error(chalk.red('Error creating demo section:'), error.message);
    }
    
    rl.close();
  }
}