#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple frontmatter parser (replacement for gray-matter)
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content };
  }
  
  const frontmatter = match[1];
  const markdown = match[2];
  const data = {};
  
  // Simple YAML parser for frontmatter
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Handle quoted values
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Handle arrays
      else if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // If parsing fails, treat as string
        }
      }
      // Handle booleans
      else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
      
      data[key] = value;
    }
  });
  
  return { data, content: markdown };
}

class ProjectValidator {
  constructor() {
    this.projectsDir = path.join(__dirname, '..', 'projects');
    this.assetsDir = path.join(__dirname, '..', 'assets', 'images');
    this.errors = [];
    this.warnings = [];
  }

  validateAllProjects() {
    console.log('🔍 Validating all projects...\n');
    
    if (!fs.existsSync(this.projectsDir)) {
      console.log('❌ Projects directory not found:', this.projectsDir);
      return false;
    }
    
    const markdownFiles = fs.readdirSync(this.projectsDir)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    if (markdownFiles.length === 0) {
      console.log('❌ No markdown files found in projects directory');
      return false;
    }
    
    let allValid = true;
    
    markdownFiles.forEach(file => {
      const projectId = path.basename(file, '.md');
      console.log(`\n📋 Validating project: ${projectId}`);
      
      if (!this.validateProject(projectId)) {
        allValid = false;
      }
    });
    
    this.printSummary();
    return allValid;
  }

  validateProject(projectId) {
    this.errors = [];
    this.warnings = [];
    
    const projectFile = path.join(this.projectsDir, `${projectId}.md`);
    
    if (!fs.existsSync(projectFile)) {
      this.addError(`Project file not found: ${projectFile}`);
      return false;
    }
    
    const fileContent = fs.readFileSync(projectFile, 'utf8');
    const { data, content } = parseFrontmatter(fileContent);
    
    // Validate required fields
    this.validateRequiredFields(data, projectId);
    
    // Validate field formats
    this.validateFieldFormats(data, projectId);
    
    // Validate images
    this.validateImages(data, projectId);
    
    // Validate content sections
    this.validateContentSections(content, projectId);
    
    // Print results for this project
    this.printProjectResults(projectId);
    
    return this.errors.length === 0;
  }

  validateRequiredFields(data, projectId) {
    const requiredFields = ['title', 'date', 'category', 'technologies'];
    
    requiredFields.forEach(field => {
      if (!data[field]) {
        this.addError(`Missing required field: ${field}`);
      } else if (Array.isArray(data[field]) && data[field].length === 0) {
        this.addError(`Required field ${field} cannot be empty`);
      }
    });
    
    // Validate date format
    if (data.date && !this.isValidDate(data.date)) {
      this.addError(`Invalid date format: ${data.date}. Expected YYYY-MM-DD`);
    }
  }

  validateFieldFormats(data, projectId) {
    // Validate technologies is an array
    if (data.technologies && !Array.isArray(data.technologies)) {
      this.addError('Technologies field must be an array');
    }
    
    // Validate images is an array
    if (data.images && !Array.isArray(data.images)) {
      this.addError('Images field must be an array');
    }
    
    // Validate featured is boolean
    if (data.featured !== undefined && typeof data.featured !== 'boolean') {
      this.addError('Featured field must be a boolean (true/false)');
    }
    
    // Validate status if present
    if (data.status && !['in-progress', 'completed', 'archived'].includes(data.status)) {
      this.addError(`Invalid status: ${data.status}. Must be one of: in-progress, completed, archived`);
    }
    
    // Validate URLs
    if (data.liveDemo && !this.isValidUrl(data.liveDemo)) {
      this.addError(`Invalid live demo URL: ${data.liveDemo}`);
    }
    
    if (data.repository && !this.isValidUrl(data.repository)) {
      this.addError(`Invalid repository URL: ${data.repository}`);
    }
  }

  validateImages(data, projectId) {
    const images = data.images || [];
    const thumbnail = data.thumbnail;
    
    // Check thumbnail
    if (thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', thumbnail);
      if (!fs.existsSync(thumbnailPath)) {
        this.addError(`Thumbnail image not found: ${thumbnail}`);
      }
    } else {
      this.addWarning('No thumbnail specified');
    }
    
    // Check other images
    images.forEach((image, index) => {
      const imagePath = path.join(__dirname, '..', image);
      if (!fs.existsSync(imagePath)) {
        this.addError(`Image ${index + 1} not found: ${image}`);
      }
    });
  }

  validateContentSections(content, projectId) {
    const requiredSections = [
      'Project Overview',
      'The Challenge',
      'The Solution',
      'Development Process',
      'Technical Implementation',
      'Results & Outcomes',
      'Lessons Learned'
    ];
    
    requiredSections.forEach(section => {
      const sectionRegex = new RegExp(`^##? ${section}\\s*$`, 'm');
      if (!sectionRegex.test(content)) {
        this.addWarning(`Missing recommended section: ${section}`);
      }
    });
    
    // Check for empty sections
    const sections = content.split(/^##? .+$/m);
    sections.forEach((section, index) => {
      if (index > 0 && section.trim().length < 50) {
        this.addWarning(`Section appears to be empty or very short`);
      }
    });
  }

  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  addError(message) {
    this.errors.push(message);
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  printProjectResults(projectId) {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`✅ ${projectId}: No issues found`);
      return;
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ ${projectId}: ${this.errors.length} error(s) found`);
      this.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  ${projectId}: ${this.warnings.length} warning(s) found`);
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  }

  printSummary() {
    console.log('\n📊 Validation Summary');
    console.log('====================');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All projects passed validation!');
    } else {
      if (this.errors.length > 0) {
        console.log(`❌ Total errors: ${this.errors.length}`);
      }
      if (this.warnings.length > 0) {
        console.log(`⚠️  Total warnings: ${this.warnings.length}`);
      }
    }
  }
}

// CLI interface
function main() {
  const command = process.argv[2];
  const projectId = process.argv[3];
  const validator = new ProjectValidator();
  
  switch (command) {
    case 'all':
      const allValid = validator.validateAllProjects();
      process.exit(allValid ? 0 : 1);
      break;
    case 'single':
      if (!projectId) {
        console.log('❌ Please provide a project ID');
        console.log('Usage: node scripts/validate-project.js single <project-id>');
        process.exit(1);
      }
      const isValid = validator.validateProject(projectId);
      process.exit(isValid ? 0 : 1);
      break;
    default:
      console.log('Project Validator\n');
      console.log('Usage:');
      console.log('  npm run project:validate:all    - Validate all projects');
      console.log('  npm run project:validate:single <id> - Validate a single project');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/validate-project.js all');
      console.log('  node scripts/validate-project.js single my-project');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProjectValidator;