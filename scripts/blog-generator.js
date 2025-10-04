#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Handlebars = require('handlebars');
const updateBlogIndex = require('./update-blog-index');

// Load configuration
const config = JSON.parse(fs.readFileSync('blog-config.json', 'utf8'));

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to prompt for multiple inputs
function promptMulti(question, delimiter = ',') {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.split(delimiter).map(item => item.trim()).filter(item => item));
    });
  });
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Format date as YYYY-MM-DD
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Calculate estimated read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Register Handlebars helpers
Handlebars.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  let ret = '';
  for (let i = 0; i < context.length; i++) {
    ret += options.fn(context[i]);
  }
  return ret;
});

// Main blog generator class
class BlogGenerator {
  constructor() {
    this.config = config;
    this.templatePath = path.join(config.blog.templatesDirectory, 'blog-post-template.md');
    this.postsDirectory = config.blog.postsDirectory;
  }

  // Generate a new blog post
  async generatePost() {
    console.log('\n📝 Blog Post Generator\n');
    
    try {
      // Collect post information
      const title = await prompt('Post title: ');
      const slug = generateSlug(title);
      const date = formatDate();
      const excerpt = await prompt('Post excerpt: ');
      const author = await prompt(`Author (${config.blog.author}): `) || config.blog.author;
      const category = await this.selectCategory();
      const tags = await promptMulti('Tags (comma-separated): ');
      const featuredImage = await prompt('Featured image URL (optional): ') || '';
      
      // Content sections
      const introduction = await prompt('Introduction: ');
      const prerequisites = await promptMulti('Prerequisites (comma-separated): ');
      const mainContent = await prompt('Main content: ');
      
      // Optional sections
      const includeCodeExamples = await this.confirm('Include code examples?');
      let codeExamples = [];
      
      if (includeCodeExamples) {
        const numExamples = parseInt(await prompt('Number of code examples: ')) || 1;
        
        for (let i = 0; i < numExamples; i++) {
          console.log(`\nCode Example ${i + 1}:`);
          const exampleTitle = await prompt('Example title: ');
          const language = await prompt('Programming language: ');
          const code = await prompt('Code (or path to file): ');
          const description = await prompt('Description: ');
          
          // If code is a file path, read the file
          let codeContent = code;
          if (fs.existsSync(code)) {
            codeContent = fs.readFileSync(code, 'utf8');
          }
          
          codeExamples.push({
            title: exampleTitle,
            language,
            code: codeContent,
            description
          });
        }
      }
      
      const tips = await promptMulti('Tips and best practices (comma-separated): ');
      const includeTroubleshooting = await this.confirm('Include troubleshooting section?');
      let troubleshooting = [];
      
      if (includeTroubleshooting) {
        const numIssues = parseInt(await prompt('Number of troubleshooting items: ')) || 1;
        
        for (let i = 0; i < numIssues; i++) {
          console.log(`\nTroubleshooting Item ${i + 1}:`);
          const issue = await prompt('Issue title: ');
          const problem = await prompt('Problem description: ');
          const solution = await prompt('Solution: ');
          
          troubleshooting.push({ issue, problem, solution });
        }
      }
      
      const conclusion = await prompt('Conclusion: ');
      const includeFurtherReading = await this.confirm('Include further reading section?');
      let furtherReading = [];
      
      if (includeFurtherReading) {
        const numResources = parseInt(await prompt('Number of resources: ')) || 1;
        
        for (let i = 0; i < numResources; i++) {
          console.log(`\nResource ${i + 1}:`);
          const title = await prompt('Resource title: ');
          const url = await prompt('Resource URL: ');
          
          furtherReading.push({ title, url });
        }
      }
      
      const includeAuthorBio = await this.confirm('Include author bio?');
      const authorBio = includeAuthorBio ? await prompt('Author bio: ') : '';
      
      // Prepare template data
      const templateData = {
        title,
        date,
        excerpt,
        tags: tags,
        author,
        category,
        featuredImage,
        published: true,
        includeTableOfContents: true,
        introduction,
        prerequisites,
        mainContent,
        codeExamples,
        tips,
        troubleshooting,
        conclusion,
        furtherReading,
        includeAuthorBio,
        authorBio
      };
      
      // Generate the blog post
      await this.createPostFromTemplate(slug, templateData);
      
      console.log(`\n✅ Blog post created successfully: ${this.postsDirectory}/${slug}.md`);
      
    } catch (error) {
      console.error('❌ Error generating blog post:', error.message);
    } finally {
      rl.close();
    }
  }

  // Select a category from the configured categories
  async selectCategory() {
    console.log('\nAvailable categories:');
    this.config.categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} - ${cat.description}`);
    });
    
    const choice = parseInt(await prompt('Select a category (number): ')) || 1;
    const category = this.config.categories[choice - 1];
    
    return category ? category.name : this.config.categories[0].name;
  }

  // Confirm a yes/no question
  async confirm(question) {
    const answer = await prompt(`${question} (y/n): `);
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
  }

  // Create a blog post from template
  async createPostFromTemplate(slug, data) {
    // Read the template
    const templateContent = fs.readFileSync(this.templatePath, 'utf8');
    
    // Compile the template
    const template = Handlebars.compile(templateContent);
    
    // Generate the content
    const content = template(data);
    
    // Calculate read time
    const readTime = calculateReadTime(content);
    
    // Update frontmatter with read time
    const updatedContent = content.replace(
      /published: true/,
      `published: true\nreadTime: "${readTime} min read"`
    );
    
    // Write the blog post
    const postPath = path.join(this.postsDirectory, `${slug}.md`);
    fs.writeFileSync(postPath, updatedContent);
    
    return postPath;
  }

  // Generate a blog post from existing code/documentation
  async generateFromCode() {
    console.log('\n📝 Generate Blog Post from Code/Documentation\n');
    
    try {
      const filePath = await prompt('Path to code/documentation file: ');
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Extract some information from the file
      const title = await prompt(`Post title (${fileName}): `) || fileName;
      const slug = generateSlug(title);
      const date = formatDate();
      
      // Try to extract a description from the first few lines
      const lines = content.split('\n').filter(line => line.trim());
      const excerpt = await prompt(`Post excerpt (${lines[0] || ''}): `) || lines[0] || '';
      
      const author = await prompt(`Author (${config.blog.author}): `) || config.blog.author;
      const category = await this.selectCategory();
      const tags = await promptMulti('Tags (comma-separated): ');
      
      // Prepare template data with the file content
      const templateData = {
        title,
        date,
        excerpt,
        tags: tags.map(tag => `"${tag}"`).join(', '),
        author,
        category,
        featuredImage: '',
        published: true,
        includeTableOfContents: true,
        introduction: `In this post, we'll explore the ${title} implementation and key concepts.`,
        prerequisites: ['Basic understanding of the subject'],
        mainContent: content,
        codeExamples: [],
        tips: [],
        troubleshooting: [],
        conclusion: `This concludes our exploration of ${title}. Feel free to experiment with the code and adapt it to your needs.`,
        furtherReading: [],
        includeAuthorBio: false,
        authorBio: ''
      };
      
      // Create the blog post
      await this.createPostFromTemplate(slug, templateData);
      
      console.log(`\n✅ Blog post created successfully: ${this.postsDirectory}/${slug}.md`);
      
    } catch (error) {
      console.error('❌ Error generating blog post from code:', error.message);
    } finally {
      rl.close();
    }
  }

  // List all blog posts
  listPosts() {
    console.log('\n📄 Blog Posts:\n');
    
    try {
      const files = fs.readdirSync(this.postsDirectory)
        .filter(file => file.endsWith('.md'))
        .sort();
      
      if (files.length === 0) {
        console.log('No blog posts found.');
        return;
      }
      
      files.forEach(file => {
        const filePath = path.join(this.postsDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
        if (frontmatterMatch) {
          const frontmatterText = frontmatterMatch[1];
          const titleMatch = frontmatterText.match(/title:\s*["'](.*)["']/);
          const dateMatch = frontmatterText.match(/date:\s*["'](.*)["']/);
          
          const title = titleMatch ? titleMatch[1] : 'Untitled';
          const date = dateMatch ? dateMatch[1] : 'Unknown date';
          
          console.log(`📄 ${file}`);
          console.log(`   Title: ${title}`);
          console.log(`   Date: ${date}`);
          console.log('');
        }
      });
    } catch (error) {
      console.error('❌ Error listing blog posts:', error.message);
    }
  }
}

// CLI interface
async function main() {
  const generator = new BlogGenerator();
  const command = process.argv[2];
  
  switch (command) {
    case 'new':
      await generator.generatePost();
      break;
    case 'from-code':
      await generator.generateFromCode();
      break;
    case 'list':
      generator.listPosts();
      break;
    default:
      console.log('Blog Generator\n');
      console.log('Usage:');
      console.log('  node scripts/blog-generator.js new       - Create a new blog post');
      console.log('  node scripts/blog-generator.js from-code - Generate from existing code/documentation');
      console.log('  node scripts/blog-generator.js list      - List all blog posts');
      break;
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BlogGenerator;