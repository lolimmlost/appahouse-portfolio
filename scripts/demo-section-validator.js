#!/usr/bin/env node

/**
 * Demo Section Validator
 * Validates demo section data for consistency and completeness
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class DemoSectionValidator {
  constructor() {
    this.demoSectionsPath = path.join(__dirname, '../demos');
    this.demoIndexPath = path.join(__dirname, '../demos.json');
    this.validationResults = {
      valid: [],
      invalid: [],
      warnings: []
    };
  }

  /**
   * Initialize the validator
   */
  async init() {
    console.log(chalk.blue('🔍 Initializing Demo Section Validator...'));
  }

  /**
   * Validate all demo sections
   */
  async validateAll() {
    console.log(chalk.blue('🔍 Validating all demo sections...'));
    
    // Reset results
    this.validationResults = {
      valid: [],
      invalid: [],
      warnings: []
    };

    // Validate main index file
    await this.validateDemoIndex();

    // Validate individual demo files
    await this.validateIndividualDemos();

    // Display results
    this.displayResults();

    return this.validationResults;
  }

  /**
   * Validate a specific demo section
   */
  async validateDemoSection(demoSection) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    const requiredFields = ['id', 'title', 'description', 'category', 'status'];
    for (const field of requiredFields) {
      if (!demoSection[field]) {
        errors.push(`Missing required field: ${field}`);
      } else if (typeof demoSection[field] !== 'string' && field !== 'technologies' && field !== 'featured') {
        errors.push(`Field ${field} must be a string`);
      }
    }

    // ID validation
    if (demoSection.id) {
      if (!/^[a-z0-9-]+$/.test(demoSection.id)) {
        errors.push('ID must contain only lowercase letters, numbers, and hyphens');
      }
      if (demoSection.id.length > 50) {
        errors.push('ID must be 50 characters or less');
      }
    }

    // Title validation
    if (demoSection.title) {
      if (demoSection.title.length < 3) {
        errors.push('Title must be at least 3 characters long');
      }
      if (demoSection.title.length > 100) {
        warnings.push('Title is longer than 100 characters, consider shortening it');
      }
    }

    // Description validation
    if (demoSection.description) {
      if (demoSection.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
      }
      if (demoSection.description.length > 500) {
        warnings.push('Description is longer than 500 characters, consider shortening it');
      }
    }

    // Category validation
    if (demoSection.category) {
      if (demoSection.category.length < 2) {
        errors.push('Category must be at least 2 characters long');
      }
      if (!/^[A-Za-z\s&-]+$/.test(demoSection.category)) {
        errors.push('Category must contain only letters, spaces, ampersands, and hyphens');
      }
    }

    // Technologies validation
    if (demoSection.technologies) {
      if (!Array.isArray(demoSection.technologies)) {
        errors.push('Technologies must be an array');
      } else {
        for (const tech of demoSection.technologies) {
          if (typeof tech !== 'string') {
            errors.push('All technologies must be strings');
          } else if (tech.length < 2) {
            warnings.push(`Technology "${tech}" is very short, consider using a more descriptive name`);
          }
        }
      }
    } else {
      warnings.push('No technologies specified for this demo');
    }

    // URLs validation
    const urlFields = ['embedUrl', 'fullscreenUrl', 'thumbnail'];
    for (const field of urlFields) {
      if (demoSection[field]) {
        if (typeof demoSection[field] !== 'string') {
          errors.push(`${field} must be a string`);
        } else if (field !== 'thumbnail' && !this.isValidUrl(demoSection[field])) {
          warnings.push(`${field} appears to be an invalid URL`);
        }
      }
    }

    // Featured validation
    if (demoSection.featured !== undefined && typeof demoSection.featured !== 'boolean') {
      errors.push('Featured must be a boolean value');
    }

    // Status validation
    if (demoSection.status) {
      const validStatuses = ['active', 'inactive', 'archived'];
      if (!validStatuses.includes(demoSection.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Date validation
    const dateFields = ['createdAt', 'updatedAt'];
    for (const field of dateFields) {
      if (demoSection[field]) {
        if (!this.isValidDate(demoSection[field])) {
          errors.push(`${field} must be a valid ISO date string`);
        }
      }
    }

    // Thumbnail validation
    if (demoSection.thumbnail) {
      if (!demoSection.thumbnail.startsWith('/') && !demoSection.thumbnail.startsWith('http')) {
        warnings.push('Thumbnail path should start with "/" for relative paths or "http" for absolute URLs');
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate URL format
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Validate ISO date format
   */
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString() === dateString;
  }

  /**
   * Validate the main demo index file
   */
  async validateDemoIndex() {
    console.log(chalk.gray('Validating demo index file...'));

    if (!fs.existsSync(this.demoIndexPath)) {
      this.validationResults.warnings.push('demos.json file not found');
      return;
    }

    try {
      const data = fs.readFileSync(this.demoIndexPath, 'utf8');
      const demoData = JSON.parse(data);

      // Check structure
      if (!demoData.sections || !Array.isArray(demoData.sections)) {
        this.validationResults.invalid.push({
          type: 'index-error',
          error: 'demos.json must have a sections array'
        });
        return;
      }

      if (!demoData.categories || !Array.isArray(demoData.categories)) {
        this.validationResults.warnings.push('demos.json should have a categories array');
      }

      if (!demoData.lastUpdated) {
        this.validationResults.warnings.push('demos.json should have a lastUpdated field');
      }

      // Validate each section in the index
      for (const section of demoData.sections) {
        const result = await this.validateDemoSection(section);
        
        if (result.errors.length === 0) {
          this.validationResults.valid.push({
            type: 'index-section',
            id: section.id,
            title: section.title
          });
        } else {
          this.validationResults.invalid.push({
            type: 'index-section',
            id: section.id,
            title: section.title,
            errors: result.errors,
            warnings: result.warnings
          });
        }

        // Add warnings to the main warnings array
        this.validationResults.warnings.push(...result.warnings.map(w => `${section.id}: ${w}`));
      }

    } catch (error) {
      this.validationResults.invalid.push({
        type: 'index-error',
        error: `Error parsing demos.json: ${error.message}`
      });
    }
  }

  /**
   * Validate individual demo files
   */
  async validateIndividualDemos() {
    console.log(chalk.gray('Validating individual demo files...'));

    if (!fs.existsSync(this.demoSectionsPath)) {
      this.validationResults.warnings.push('demos directory not found');
      return;
    }

    const files = fs.readdirSync(this.demoSectionsPath);
    const demoFiles = files.filter(file => file.endsWith('.json'));

    if (demoFiles.length === 0) {
      this.validationResults.warnings.push('No demo files found in demos directory');
      return;
    }

    for (const file of demoFiles) {
      try {
        const filePath = path.join(this.demoSectionsPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const demoSection = JSON.parse(data);

        const result = await this.validateDemoSection(demoSection);
        
        if (result.errors.length === 0) {
          this.validationResults.valid.push({
            type: 'individual-file',
            id: demoSection.id,
            title: demoSection.title,
            file: file
          });
        } else {
          this.validationResults.invalid.push({
            type: 'individual-file',
            id: demoSection.id,
            title: demoSection.title,
            file: file,
            errors: result.errors,
            warnings: result.warnings
          });
        }

        // Add warnings to the main warnings array
        this.validationResults.warnings.push(...result.warnings.map(w => `${file}: ${w}`));

      } catch (error) {
      this.validationResults.invalid.push({
        type: 'file-error',
        file: file,
        error: `Error parsing demo file ${file}: ${error.message}`
      });
      }
    }
  }

  /**
   * Display validation results
   */
  displayResults() {
    console.log(chalk.blue('\n📊 Validation Results:\n'));

    // Valid sections
    if (this.validationResults.valid.length > 0) {
      console.log(chalk.green(`✅ Valid sections (${this.validationResults.valid.length}):`));
      this.validationResults.valid.forEach(section => {
        const location = section.type === 'index-section' ? 'Index' : section.file;
        console.log(`   ${section.title} (${location})`);
      });
      console.log('');
    }

    // Invalid sections
    if (this.validationResults.invalid.length > 0) {
      console.log(chalk.red(`❌ Invalid sections (${this.validationResults.invalid.length}):`));
      this.validationResults.invalid.forEach(section => {
        const location = section.type === 'index-section' ? 'Index' : section.file;
        console.log(`   ${chalk.bold(section.title)} (${location})`);
        section.errors.forEach(error => {
          console.log(`     ${chalk.red('Error:')} ${error}`);
        });
        section.warnings.forEach(warning => {
          console.log(`     ${chalk.yellow('Warning:')} ${warning}`);
        });
        console.log('');
      });
    }

    // Warnings
    if (this.validationResults.warnings.length > 0) {
      console.log(chalk.yellow(`⚠️  Warnings (${this.validationResults.warnings.length}):`));
      this.validationResults.warnings.forEach(warning => {
        console.log(`   ${warning}`);
      });
      console.log('');
    }

    // Summary
    const total = this.validationResults.valid.length + this.validationResults.invalid.length;
    console.log(chalk.blue('📈 Summary:'));
    console.log(`   Total sections: ${total}`);
    console.log(`   Valid: ${chalk.green(this.validationResults.valid.length)}`);
    console.log(`   Invalid: ${chalk.red(this.validationResults.invalid.length)}`);
    console.log(`   Warnings: ${chalk.yellow(this.validationResults.warnings.length)}`);

    if (this.validationResults.invalid.length === 0) {
      console.log(chalk.green('\n🎉 All demo sections are valid!'));
    } else {
      console.log(chalk.red('\n💥 Some demo sections have validation errors. Please fix them before proceeding.'));
    }
  }

  /**
   * Validate a specific demo file
   */
  async validateFile(filePath) {
    console.log(chalk.blue(`🔍 Validating demo file: ${filePath}`));

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`File not found: ${filePath}`));
      return false;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const demoSection = JSON.parse(data);

      const result = await this.validateDemoSection(demoSection);
      
      if (result.errors.length === 0) {
        console.log(chalk.green(`✅ ${demoSection.title} is valid`));
        if (result.warnings.length > 0) {
          console.log(chalk.yellow('Warnings:'));
          result.warnings.forEach(warning => {
            console.log(`   ${warning}`);
          });
        }
        return true;
      } else {
        console.log(chalk.red(`❌ ${demoSection.title} has validation errors:`));
        result.errors.forEach(error => {
          console.log(`   ${error}`);
        });
        if (result.warnings.length > 0) {
          console.log(chalk.yellow('Warnings:'));
          result.warnings.forEach(warning => {
            console.log(`   ${warning}`);
          });
        }
        return false;
      }
    } catch (error) {
      console.error(chalk.red(`Error validating file: ${error.message}`));
      return false;
    }
  }
}

module.exports = DemoSectionValidator;

// CLI functionality
if (require.main === module) {
  const validator = new DemoSectionValidator();
  
  validator.init().then(() => {
    const command = process.argv[2];
    const filePath = process.argv[3];
    
    switch (command) {
      case 'all':
        validator.validateAll().then(() => {
          process.exit(validator.validationResults.invalid.length > 0 ? 1 : 0);
        });
        break;
      case 'file':
        if (!filePath) {
          console.error(chalk.red('Please provide a file path'));
          process.exit(1);
        }
        validator.validateFile(filePath).then(isValid => {
          process.exit(isValid ? 0 : 1);
        });
        break;
      default:
        console.log(chalk.blue('Available commands:'));
        console.log('  all        - Validate all demo sections');
        console.log('  file <path> - Validate a specific demo file');
    }
  }).catch(error => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
}