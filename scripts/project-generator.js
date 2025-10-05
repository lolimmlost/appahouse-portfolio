#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

class ProjectGenerator {
  constructor() {
    this.projectsDir = path.join(__dirname, '..', 'projects');
    this.templatesDir = path.join(__dirname, '..', 'templates');
    this.projectsJsonPath = path.join(__dirname, '..', 'projects.json');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.projectsDir)) {
      fs.mkdirSync(this.projectsDir, { recursive: true });
    }
  }

  async createNewProject() {
    console.log('\n🚀 Create a New Project Case Study\n');
    
    try {
      // Get project information
      const projectInfo = await this.getProjectInfo();
      
      // Generate project ID
      const projectId = this.generateProjectId(projectInfo.title);
      
      // Create project markdown file
      await this.createProjectMarkdown(projectId, projectInfo);
      
      // Update projects.json
      await this.updateProjectsJson(projectId, projectInfo);
      
      console.log(`\n✅ Project "${projectInfo.title}" created successfully!`);
      console.log(`📁 Markdown file: projects/${projectId}.md`);
      console.log(`🔗 Projects database updated: projects.json`);
      
    } catch (error) {
      console.error('❌ Error creating project:', error.message);
    } finally {
      rl.close();
    }
  }

  async getProjectInfo() {
    const projectInfo = {};
    
    projectInfo.title = await question('Project title: ');
    projectInfo.client = await question('Client name (optional, press Enter to skip): ') || null;
    projectInfo.category = await question('Category (Web Development, Data Visualization, Machine Learning, etc.): ');
    projectInfo.description = await question('Short description: ');
    projectInfo.liveDemo = await question('Live demo URL (optional, press Enter to skip): ') || null;
    projectInfo.repository = await question('Repository URL (optional, press Enter to skip): ') || null;
    projectInfo.developmentTime = await question('Development time (e.g., "3 months"): ');
    projectInfo.linesOfCode = await question('Lines of code (e.g., "15000"): ');
    
    // Featured project
    const featuredAnswer = await question('Is this a featured project? (y/n): ');
    projectInfo.featured = featuredAnswer.toLowerCase() === 'y' || featuredAnswer.toLowerCase() === 'yes';
    
    // Project status
    console.log('\nProject status options:');
    console.log('1. in-progress - Currently being developed');
    console.log('2. completed - Finished and deployed');
    console.log('3. archived - No longer maintained');
    const statusAnswer = await question('Select project status (1-3, default: 2): ') || '2';
    
    switch (statusAnswer) {
      case '1':
        projectInfo.status = 'in-progress';
        break;
      case '2':
        projectInfo.status = 'completed';
        break;
      case '3':
        projectInfo.status = 'archived';
        break;
      default:
        projectInfo.status = 'completed';
    }
    
    // Technologies
    const techAnswer = await question('Technologies (comma-separated, e.g., React, Node.js, MongoDB): ');
    projectInfo.technologies = techAnswer.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    // Images
    const imagesAnswer = await question('Project images (comma-separated paths, e.g., /assets/images/project-1.jpg): ');
    projectInfo.images = imagesAnswer.split(',').map(img => img.trim()).filter(img => img);
    
    // Generate thumbnail from first image or ask for it
    if (projectInfo.images.length > 0) {
      projectInfo.thumbnail = projectInfo.images[0];
    } else {
      projectInfo.thumbnail = await question('Thumbnail image path: ') || '/assets/images/placeholder.jpg';
    }
    
    // Set current date
    projectInfo.date = new Date().toISOString().split('T')[0];
    
    return projectInfo;
  }

  generateProjectId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async createProjectMarkdown(projectId, projectInfo) {
    const templatePath = path.join(this.templatesDir, 'project-template.md');
    let template = '';
    
    if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
    } else {
      // Fallback template if file doesn't exist
      template = `---
title: "${projectInfo.title}"
client: "${projectInfo.client || ''}"
date: "${projectInfo.date}"
category: "${projectInfo.category}"
technologies: ${JSON.stringify(projectInfo.technologies)}
featured: ${projectInfo.featured}
thumbnail: "${projectInfo.thumbnail}"
liveDemo: "${projectInfo.liveDemo || ''}"
repository: "${projectInfo.repository || ''}"
developmentTime: "${projectInfo.developmentTime}"
linesOfCode: "${projectInfo.linesOfCode}"
images: ${JSON.stringify(projectInfo.images)}
---

# Project Overview

${projectInfo.description}

## The Challenge

Detailed description of the problem or challenge.

## The Solution

Explanation of the technical solution and approach.

## Development Process

Step-by-step breakdown of the development process.

## Technical Implementation

Detailed technical information about the implementation.

## Results & Outcomes

Metrics, results, and impact of the project.

## Lessons Learned

Key takeaways and insights from the project.
`;
    }
    
    // Replace template variables
    template = template.replace(/"Project Title"/g, `"${projectInfo.title}"`);
    template = template.replace(/"Client Name \(if applicable\)"/g, `"${projectInfo.client || ''}"`);
    template = template.replace(/"YYYY-MM-DD"/g, `"${projectInfo.date}"`);
    template = template.replace(/"Web Development"/g, `"${projectInfo.category}"`);
    template = template.replace(/\["React", "Node.js", "MongoDB"\]/g, JSON.stringify(projectInfo.technologies));
    template = template.replace(/true/g, projectInfo.featured);
    template = template.replace(/"completed"/g, `"${projectInfo.status}"`);
    template = template.replace(/"\/assets\/images\/project-thumb.jpg"/g, `"${projectInfo.thumbnail}"`);
    template = template.replace(/"https:\/\/example.com"/g, `"${projectInfo.liveDemo || ''}"`);
    template = template.replace(/"https:\/\/github.com\/user\/repo"/g, `"${projectInfo.repository || ''}"`);
    template = template.replace(/"X months"/g, `"${projectInfo.developmentTime}"`);
    template = template.replace(/"XXXXX"/g, `"${projectInfo.linesOfCode}"`);
    template = template.replace(/\[\/assets\/images\/project-1.jpg", "\/assets\/images\/project-2.jpg", "\/assets\/images\/project-3.jpg"\]/g, JSON.stringify(projectInfo.images));
    template = template.replace(/Brief description of the project and its objectives./g, projectInfo.description);
    
    const markdownPath = path.join(this.projectsDir, `${projectId}.md`);
    fs.writeFileSync(markdownPath, template);
  }

  async updateProjectsJson(projectId, projectInfo) {
    let projectsData = { projects: [], categories: [], technologies: [] };
    
    // Read existing projects.json if it exists
    if (fs.existsSync(this.projectsJsonPath)) {
      const existingData = fs.readFileSync(this.projectsJsonPath, 'utf8');
      projectsData = JSON.parse(existingData);
    }
    
    // Create project object
    const project = {
      id: projectId,
      title: projectInfo.title,
      description: projectInfo.description,
      thumbnail: projectInfo.thumbnail,
      featured: projectInfo.featured,
      date: projectInfo.date,
      category: projectInfo.category,
      technologies: projectInfo.technologies,
      liveDemo: projectInfo.liveDemo,
      repository: projectInfo.repository,
      developmentTime: projectInfo.developmentTime,
      linesOfCode: projectInfo.linesOfCode,
      images: projectInfo.images,
      status: projectInfo.status,
      overview: projectInfo.description,
      challenge: "Detailed description of the problem or challenge.",
      solution: "Explanation of the technical solution and approach.",
      developmentProcess: "Step-by-step breakdown of the development process.",
      technicalImplementation: "Detailed technical information about the implementation.",
      results: "Metrics, results, and impact of the project.",
      lessonsLearned: "Key takeaways and insights from the project."
    };
    
    // Add project to array
    projectsData.projects.push(project);
    
    // Update categories
    if (!projectsData.categories.includes(projectInfo.category)) {
      projectsData.categories.push(projectInfo.category);
    }
    
    // Update technologies
    projectInfo.technologies.forEach(tech => {
      if (!projectsData.technologies.includes(tech)) {
        projectsData.technologies.push(tech);
      }
    });
    
    // Sort projects by date (newest first)
    projectsData.projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write back to projects.json
    fs.writeFileSync(this.projectsJsonPath, JSON.stringify(projectsData, null, 2));
  }

  async listProjects() {
    console.log('\n📋 Existing Projects\n');
    
    if (!fs.existsSync(this.projectsJsonPath)) {
      console.log('No projects found. Create your first project with: npm run project:new');
      rl.close();
      return;
    }
    
    const projectsData = JSON.parse(fs.readFileSync(this.projectsJsonPath, 'utf8'));
    
    if (projectsData.projects.length === 0) {
      console.log('No projects found. Create your first project with: npm run project:new');
      rl.close();
      return;
    }
    
    projectsData.projects.forEach((project, index) => {
      const featured = project.featured ? '⭐' : '  ';
      console.log(`${featured} ${index + 1}. ${project.title} (${project.category})`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Date: ${project.date}`);
      console.log(`   Technologies: ${project.technologies.join(', ')}`);
      console.log('');
    });
    
    rl.close();
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const generator = new ProjectGenerator();
  
  switch (command) {
    case 'new':
      await generator.createNewProject();
      break;
    case 'list':
      await generator.listProjects();
      break;
    default:
      console.log('Project Generator\n');
      console.log('Usage:');
      console.log('  npm run project:new    - Create a new project case study');
      console.log('  npm run project:list   - List existing projects');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/project-generator.js new');
      console.log('  node scripts/project-generator.js list');
      rl.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProjectGenerator;