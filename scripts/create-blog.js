#!/usr/bin/env node

const BlogGenerator = require('./blog-generator');
const fs = require('fs');
const path = require('path');
const updateBlogIndex = require('./update-blog-index');

// Quick blog post creation utility
class QuickBlogCreator {
  constructor() {
    this.generator = new BlogGenerator();
  }

  // Create a quick blog post with minimal input
  async createQuickPost(options = {}) {
    const {
      title,
      content,
      tags = [],
      category = 'Tutorial',
      author = 'AppaHouse Team'
    } = options;

    if (!title || !content) {
      console.error('❌ Title and content are required');
      process.exit(1);
    }

    const slug = this.generateSlug(title);
    const date = new Date().toISOString().split('T')[0];
    const excerpt = content.substring(0, 150) + '...';

    const templateData = {
      title,
      date,
      excerpt,
      tags: tags,
      author,
      category,
      featuredImage: '',
      published: true,
      includeTableOfContents: true,
      introduction: `In this post, we'll explore ${title}.`,
      prerequisites: [],
      mainContent: content,
      codeExamples: [],
      tips: [],
      troubleshooting: [],
      conclusion: `This concludes our exploration of ${title}.`,
      furtherReading: [],
      includeAuthorBio: false,
      authorBio: ''
    };

    try {
      await this.generator.createPostFromTemplate(slug, templateData);
      // Update the blog index
      updateBlogIndex();
      console.log(`✅ Quick blog post created: blog/${slug}.md`);
      return slug;
    } catch (error) {
      console.error('❌ Error creating quick blog post:', error.message);
      throw error;
    }
  }

  // Generate slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Create a blog post from a markdown file
  async createFromMarkdown(filePath, options = {}) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.md');
    
    // Extract title from first h1 or filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = options.title || (titleMatch ? titleMatch[1] : fileName);
    
    // Remove the title from content if it exists
    const mainContent = titleMatch ? content.replace(/^#\s+.+$/m, '').trim() : content;
    
    return this.createQuickPost({
      title,
      content: mainContent,
      ...options
    });
  }

  // Create a blog post from a code file
  async createFromCodeFile(filePath, options = {}) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath).substring(1);
    
    const title = options.title || `Understanding ${fileName}`;
    
    // Create a code block with the file content
    const codeContent = `\`\`\`${extension}\n${content}\n\`\`\``;
    
    const mainContent = `
In this post, we'll examine the ${fileName} file and understand its implementation.

${codeContent}

Let's break down what this code does:

1. **Structure**: The file follows a clear structure
2. **Implementation**: Key implementation details
3. **Usage**: How to use this code in your projects

This code demonstrates important concepts that can be applied in various scenarios.
    `.trim();
    
    return this.createQuickPost({
      title,
      content: mainContent,
      tags: [...(options.tags || []), extension, 'Code Example'],
      ...options
    });
  }

  // Batch create blog posts from a directory
  async batchCreateFromDirectory(dirPath, options = {}) {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }

    const files = fs.readdirSync(dirPath);
    const createdPosts = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        const extension = path.extname(file).substring(1);
        
        try {
          let slug;
          if (extension === 'md') {
            slug = await this.createFromMarkdown(filePath, options);
          } else {
            slug = await this.createFromCodeFile(filePath, options);
          }
          createdPosts.push(slug);
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Created ${createdPosts.length} blog posts:`);
    createdPosts.forEach(slug => console.log(`  - ${slug}.md`));
    
    return createdPosts;
  }
}

// CLI interface
async function main() {
  const creator = new QuickBlogCreator();
  const command = process.argv[2];
  const filePath = process.argv[3];

  try {
    switch (command) {
      case 'from-md':
        if (!filePath) {
          console.error('❌ Please provide a markdown file path');
          process.exit(1);
        }
        await creator.createFromMarkdown(filePath);
        break;
        
      case 'from-code':
        if (!filePath) {
          console.error('❌ Please provide a code file path');
          process.exit(1);
        }
        await creator.createFromCodeFile(filePath);
        break;
        
      case 'batch':
        if (!filePath) {
          console.error('❌ Please provide a directory path');
          process.exit(1);
        }
        await creator.batchCreateFromDirectory(filePath);
        break;
        
      default:
        console.log('Quick Blog Creator\n');
        console.log('Usage:');
        console.log('  node scripts/create-blog.js from-md <file.md>      - Create from markdown file');
        console.log('  node scripts/create-blog.js from-code <file.ext>   - Create from code file');
        console.log('  node scripts/create-blog.js batch <directory>      - Batch create from directory');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = QuickBlogCreator;