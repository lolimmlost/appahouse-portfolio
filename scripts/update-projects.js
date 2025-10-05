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

class ProjectUpdater {
  constructor() {
    this.projectsDir = path.join(__dirname, '..', 'projects');
    this.projectsJsonPath = path.join(__dirname, '..', 'projects.json');
  }

  updateAllProjects() {
    console.log('🔄 Updating projects from markdown files...\n');
    
    if (!fs.existsSync(this.projectsDir)) {
      console.log('❌ Projects directory not found:', this.projectsDir);
      return;
    }
    
    const markdownFiles = fs.readdirSync(this.projectsDir)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    if (markdownFiles.length === 0) {
      console.log('❌ No markdown files found in projects directory');
      return;
    }
    
    const projectsData = {
      projects: [],
      categories: [],
      technologies: []
    };
    
    markdownFiles.forEach(file => {
      const filePath = path.join(this.projectsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = parseFrontmatter(fileContent);
      
      // Generate project ID from filename (without .md extension)
      const projectId = path.basename(file, '.md');
      
      // Extract sections from content
      const sections = this.extractSections(content);
      
      // Create project object
      const project = {
        id: projectId,
        title: data.title || 'Untitled Project',
        description: this.extractFirstParagraph(content) || 'No description available',
        thumbnail: data.thumbnail || '/assets/images/placeholder.jpg',
        featured: data.featured || false,
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Web Development',
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        liveDemo: data.liveDemo || null,
        repository: data.repository || null,
        developmentTime: data.developmentTime || 'Unknown',
        linesOfCode: data.linesOfCode || 'Unknown',
        images: Array.isArray(data.images) ? data.images : [],
        client: data.client || null,
        overview: sections.overview || 'No overview available',
        challenge: sections.challenge || 'No challenge information available',
        solution: sections.solution || 'No solution information available',
        developmentProcess: sections.developmentProcess || 'No development process information available',
        technicalImplementation: sections.technicalImplementation || 'No technical implementation information available',
        results: sections.results || 'No results information available',
        lessonsLearned: sections.lessonsLearned || 'No lessons learned information available'
      };
      
      projectsData.projects.push(project);
      
      // Update categories
      if (!projectsData.categories.includes(project.category)) {
        projectsData.categories.push(project.category);
      }
      
      // Update technologies
      project.technologies.forEach(tech => {
        if (!projectsData.technologies.includes(tech)) {
          projectsData.technologies.push(tech);
        }
      });
      
      console.log(`✅ Processed: ${project.title}`);
    });
    
    // Sort projects by date (newest first)
    projectsData.projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Sort categories and technologies alphabetically
    projectsData.categories.sort();
    projectsData.technologies.sort();
    
    // Write to projects.json
    fs.writeFileSync(this.projectsJsonPath, JSON.stringify(projectsData, null, 2));
    
    console.log(`\n🎉 Successfully updated ${projectsData.projects.length} projects!`);
    console.log(`📁 Projects database: ${this.projectsJsonPath}`);
    console.log(`🏷️  Categories: ${projectsData.categories.length}`);
    console.log(`🔧 Technologies: ${projectsData.technologies.length}`);
  }

  extractSections(content) {
    const sections = {};
    
    // Define section patterns
    const sectionPatterns = [
      { name: 'overview', pattern: /^# Project Overview\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'challenge', pattern: /^## The Challenge\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'solution', pattern: /^## The Solution\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'developmentProcess', pattern: /^## Development Process\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'technicalImplementation', pattern: /^## Technical Implementation\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'results', pattern: /^## Results & Outcomes\n\n([\s\S]*?)(?=\n## |\n# |$)/m },
      { name: 'lessonsLearned', pattern: /^## Lessons Learned\n\n([\s\S]*?)(?=\n## |\n# |$)/m }
    ];
    
    // Extract each section
    sectionPatterns.forEach(({ name, pattern }) => {
      const match = content.match(pattern);
      if (match) {
        sections[name] = match[1].trim();
      }
    });
    
    return sections;
  }

  extractFirstParagraph(content) {
    // Remove frontmatter if present
    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, '');
    
    // Find the first paragraph (text before first double newline or heading)
    const firstParagraph = contentWithoutFrontmatter.match(/^(.+?)(?=\n\n|\n#|$)/m);
    return firstParagraph ? firstParagraph[1].trim() : '';
  }

  updateSingleProject(projectId) {
    const projectFile = path.join(this.projectsDir, `${projectId}.md`);
    
    if (!fs.existsSync(projectFile)) {
      console.log(`❌ Project file not found: ${projectFile}`);
      return;
    }
    
    console.log(`🔄 Updating project: ${projectId}`);
    
    // Read existing projects.json
    let projectsData = { projects: [], categories: [], technologies: [] };
    if (fs.existsSync(this.projectsJsonPath)) {
      const existingData = fs.readFileSync(this.projectsJsonPath, 'utf8');
      projectsData = JSON.parse(existingData);
    }
    
    // Read and parse the markdown file
    const fileContent = fs.readFileSync(projectFile, 'utf8');
    const { data, content } = parseFrontmatter(fileContent);
    
    // Extract sections from content
    const sections = this.extractSections(content);
    
    // Create updated project object
    const updatedProject = {
      id: projectId,
      title: data.title || 'Untitled Project',
      description: this.extractFirstParagraph(content) || 'No description available',
      thumbnail: data.thumbnail || '/assets/images/placeholder.jpg',
      featured: data.featured || false,
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'Web Development',
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      liveDemo: data.liveDemo || null,
      repository: data.repository || null,
      developmentTime: data.developmentTime || 'Unknown',
      linesOfCode: data.linesOfCode || 'Unknown',
      images: Array.isArray(data.images) ? data.images : [],
      client: data.client || null,
      overview: sections.overview || 'No overview available',
      challenge: sections.challenge || 'No challenge information available',
      solution: sections.solution || 'No solution information available',
      developmentProcess: sections.developmentProcess || 'No development process information available',
      technicalImplementation: sections.technicalImplementation || 'No technical implementation information available',
      results: sections.results || 'No results information available',
      lessonsLearned: sections.lessonsLearned || 'No lessons learned information available'
    };
    
    // Find and replace the existing project or add it if it doesn't exist
    const existingIndex = projectsData.projects.findIndex(p => p.id === projectId);
    if (existingIndex !== -1) {
      projectsData.projects[existingIndex] = updatedProject;
      console.log(`✅ Updated existing project: ${updatedProject.title}`);
    } else {
      projectsData.projects.push(updatedProject);
      console.log(`✅ Added new project: ${updatedProject.title}`);
    }
    
    // Update categories and technologies
    if (!projectsData.categories.includes(updatedProject.category)) {
      projectsData.categories.push(updatedProject.category);
    }
    
    updatedProject.technologies.forEach(tech => {
      if (!projectsData.technologies.includes(tech)) {
        projectsData.technologies.push(tech);
      }
    });
    
    // Sort projects by date
    projectsData.projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    projectsData.categories.sort();
    projectsData.technologies.sort();
    
    // Write back to projects.json
    fs.writeFileSync(this.projectsJsonPath, JSON.stringify(projectsData, null, 2));
    
    console.log(`🎉 Project "${updatedProject.title}" updated successfully!`);
  }
}

// CLI interface
function main() {
  const command = process.argv[2];
  const projectId = process.argv[3];
  const updater = new ProjectUpdater();
  
  switch (command) {
    case 'all':
      updater.updateAllProjects();
      break;
    case 'single':
      if (!projectId) {
        console.log('❌ Please provide a project ID');
        console.log('Usage: node scripts/update-projects.js single <project-id>');
        process.exit(1);
      }
      updater.updateSingleProject(projectId);
      break;
    default:
      console.log('Project Updater\n');
      console.log('Usage:');
      console.log('  npm run project:update:all    - Update all projects from markdown files');
      console.log('  npm run project:update:single <id> - Update a single project');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/update-projects.js all');
      console.log('  node scripts/update-projects.js single my-project');
  }
}

if (require.main === module) {
  main();
}

module.exports = ProjectUpdater;