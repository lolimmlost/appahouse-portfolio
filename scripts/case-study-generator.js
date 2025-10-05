#!/usr/bin/env node

/**
 * Case Study Generator Script
 * Used to create, list, and manage case studies
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CASE_STUDIES_FILE = path.join(__dirname, '../case-studies.json');
const CASE_STUDIES_DIR = path.join(__dirname, '../case-studies');

// Create case studies directory if it doesn't exist
if (!fs.existsSync(CASE_STUDIES_DIR)) {
  fs.mkdirSync(CASE_STUDIES_DIR, { recursive: true });
}

// Create interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to prompt for input
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Load case studies from JSON file
function loadCaseStudies() {
  try {
    if (fs.existsSync(CASE_STUDIES_FILE)) {
      const data = fs.readFileSync(CASE_STUDIES_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { caseStudies: [], categories: [], technologies: [] };
  } catch (error) {
    console.error('Error loading case studies:', error.message);
    return { caseStudies: [], categories: [], technologies: [] };
  }
}

// Save case studies to JSON file
function saveCaseStudies(data) {
  try {
    fs.writeFileSync(CASE_STUDIES_FILE, JSON.stringify(data, null, 2));
    console.log('Case studies saved successfully!');
  } catch (error) {
    console.error('Error saving case studies:', error.message);
  }
}

// Generate a unique ID from title
function generateId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Create a new case study
async function createCaseStudy() {
  console.log('\n=== Create New Case Study ===\n');
  
  const title = await question('Case study title: ');
  const category = await question('Category: ');
  const client = await question('Client name (press Enter to skip): ');
  const excerpt = await question('Brief excerpt: ');
  const overview = await question('Project overview: ');
  const challenge = await question('The challenge: ');
  const solution = await question('The solution: ');
  const developmentProcess = await question('Development process: ');
  const technicalImplementation = await question('Technical implementation: ');
  const results = await question('Results & outcomes: ');
  const lessonsLearned = await question('Lessons learned: ');
  
  const liveDemo = await question('Live demo URL (press Enter to skip): ');
  const repository = await question('Repository URL (press Enter to skip): ');
  const developmentTime = await question('Development time (e.g., "2 Weeks"): ');
  const linesOfCode = await question('Lines of code (e.g., "10000"): ');
  
  // Technologies input
  const technologiesInput = await question('Technologies (comma-separated): ');
  const technologies = technologiesInput.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  // Featured
  const featuredInput = await question('Featured? (y/n, default: n): ');
  const featured = featuredInput.toLowerCase() === 'y';
  
  // Generate case study data
  const id = generateId(title);
  const date = getCurrentDate();
  
  const caseStudy = {
    id,
    title,
    category,
    excerpt,
    overview,
    challenge,
    solution,
    developmentProcess,
    technicalImplementation,
    results,
    lessonsLearned,
    client: client || null,
    liveDemo: liveDemo || null,
    repository: repository || null,
    developmentTime: developmentTime || null,
    linesOfCode: linesOfCode || null,
    technologies,
    featured,
    date,
    thumbnail: `/assets/images/${id}-thumb.jpg`,
    image: `/assets/images/${id}.jpg`
  };
  
  // Load existing data
  const data = loadCaseStudies();
  
  // Check if ID already exists
  if (data.caseStudies.find(cs => cs.id === id)) {
    console.log(`\nError: A case study with ID "${id}" already exists.`);
    rl.close();
    return;
  }
  
  // Add new case study
  data.caseStudies.push(caseStudy);
  
  // Update categories and technologies
  if (!data.categories.includes(category)) {
    data.categories.push(category);
  }
  
  technologies.forEach(tech => {
    if (!data.technologies.includes(tech)) {
      data.technologies.push(tech);
    }
  });
  
  // Sort categories and technologies
  data.categories.sort();
  data.technologies.sort();
  
  // Save data
  saveCaseStudies(data);
  
  // Create markdown file
  const markdownContent = createMarkdownFile(caseStudy);
  const markdownPath = path.join(CASE_STUDIES_DIR, `${id}.md`);
  fs.writeFileSync(markdownPath, markdownContent);
  
  console.log(`\nCase study "${title}" created successfully!`);
  console.log(`ID: ${id}`);
  console.log(`Markdown file: ${markdownPath}`);
  console.log(`Don't forget to add images to assets/images/`);
  
  rl.close();
}

// Create markdown file content
function createMarkdownFile(caseStudy) {
  return `---
title: "${caseStudy.title}"
client: "${caseStudy.client || ''}"
date: "${caseStudy.date}"
category: "${caseStudy.category}"
technologies: [${caseStudy.technologies.map(tech => `"${tech}"`).join(', ')}]
featured: ${caseStudy.featured}
thumbnail: "${caseStudy.thumbnail}"
liveDemo: "${caseStudy.liveDemo || ''}"
repository: "${caseStudy.repository || ''}"
developmentTime: "${caseStudy.developmentTime || ''}"
linesOfCode: "${caseStudy.linesOfCode || ''}"
images: [
  "${caseStudy.image}"
]
---

# Project Overview

${caseStudy.overview}

## The Challenge

${caseStudy.challenge}

## The Solution

${caseStudy.solution}

## Development Process

${caseStudy.developmentProcess}

## Technical Implementation

${caseStudy.technicalImplementation}

## Results & Outcomes

${caseStudy.results}

## Lessons Learned

${caseStudy.lessonsLearned}
`;
}

// List all case studies
function listCaseStudies() {
  const data = loadCaseStudies();
  
  if (data.caseStudies.length === 0) {
    console.log('No case studies found.');
    rl.close();
    return;
  }
  
  console.log('\n=== Case Studies ===\n');
  
  data.caseStudies.forEach((caseStudy, index) => {
    console.log(`${index + 1}. ${caseStudy.title}`);
    console.log(`   ID: ${caseStudy.id}`);
    console.log(`   Category: ${caseStudy.category}`);
    console.log(`   Date: ${caseStudy.date}`);
    console.log(`   Technologies: ${caseStudy.technologies.join(', ')}`);
    console.log(`   Featured: ${caseStudy.featured ? 'Yes' : 'No'}`);
    console.log('');
  });
  
  rl.close();
}

// Update case studies index from markdown files
function updateCaseStudiesIndex() {
  console.log('Updating case studies index from markdown files...');
  
  if (!fs.existsSync(CASE_STUDIES_DIR)) {
    console.log('No case studies directory found.');
    rl.close();
    return;
  }
  
  const files = fs.readdirSync(CASE_STUDIES_DIR).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('No markdown files found in case studies directory.');
    rl.close();
    return;
  }
  
  const data = { caseStudies: [], categories: [], technologies: [] };
  
  files.forEach(file => {
    const filePath = path.join(CASE_STUDIES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
      console.log(`Warning: No front matter found in ${file}`);
      return;
    }
    
    try {
      const frontMatter = frontMatterMatch[1];
      const caseStudy = {};
      
      // Parse front matter
      frontMatter.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          const [, key, value] = match;
          
          // Handle different value types
          if (value.startsWith('[') && value.endsWith(']')) {
            // Array
            caseStudy[key] = value.slice(1, -1).split(',').map(item => 
              item.trim().replace(/^"(.*)"$/, '$1')
            );
          } else if (value === 'true' || value === 'false') {
            // Boolean
            caseStudy[key] = value === 'true';
          } else if (value.startsWith('"') && value.endsWith('"')) {
            // String
            caseStudy[key] = value.slice(1, -1);
          } else {
            // String without quotes
            caseStudy[key] = value;
          }
        }
      });
      
      // Extract content sections
      const contentWithoutFrontMatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
      const sections = {};
      
      // Extract sections using regex
      const sectionMatches = contentWithoutFrontMatter.match(/## (.+)\n([\s\S]*?)(?=\n## |\n$|$)/g);
      if (sectionMatches) {
        sectionMatches.forEach(section => {
          const sectionMatch = section.match(/## (.+)\n([\s\S]*)/);
          if (sectionMatch) {
            const [, title, content] = sectionMatch;
            const key = title.toLowerCase().replace(/\s+/g, '');
            sections[key] = content.trim();
          }
        });
      }
      
      // Add sections to case study
      Object.assign(caseStudy, sections);
      
      data.caseStudies.push(caseStudy);
      
      // Update categories and technologies
      if (caseStudy.category && !data.categories.includes(caseStudy.category)) {
        data.categories.push(caseStudy.category);
      }
      
      if (caseStudy.technologies) {
        caseStudy.technologies.forEach(tech => {
          if (!data.technologies.includes(tech)) {
            data.technologies.push(tech);
          }
        });
      }
    } catch (error) {
      console.log(`Error parsing ${file}: ${error.message}`);
    }
  });
  
  // Sort categories and technologies
  data.categories.sort();
  data.technologies.sort();
  
  // Save data
  saveCaseStudies(data);
  
  console.log(`Updated case studies index with ${data.caseStudies.length} case studies.`);
  rl.close();
}

// Main function
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'new':
      await createCaseStudy();
      break;
    case 'list':
      listCaseStudies();
      break;
    case 'update':
      updateCaseStudiesIndex();
      break;
    default:
      console.log('Case Study Generator');
      console.log('');
      console.log('Usage:');
      console.log('  node case-study-generator.js new    - Create a new case study');
      console.log('  node case-study-generator.js list   - List all case studies');
      console.log('  node case-study-generator.js update - Update case studies index from markdown files');
      rl.close();
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error.message);
  rl.close();
});