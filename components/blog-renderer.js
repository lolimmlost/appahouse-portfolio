// Enhanced markdown renderer for blog posts with frontmatter parsing
class BlogRenderer {
  constructor() {
    this.blogPosts = [];
    this.blogContainer = document.getElementById('blog-posts');
    this.config = null;
  }

  // Initialize the blog system
  async init() {
    // Load blog configuration
    await this.loadBlogConfig();
    
    // Load blog posts
    await this.loadBlogPosts();
    
    // Render blog posts if container exists
    if (this.blogContainer) {
      this.renderBlogPosts();
    }
  }

  // Load blog configuration
  async loadBlogConfig() {
    try {
      const response = await fetch('blog-config.json');
      if (!response.ok) {
        throw new Error(`Failed to load blog config: ${response.status}`);
      }
      this.config = await response.json();
    } catch (error) {
      console.error('Error loading blog configuration:', error);
      // Use default configuration if loading fails
      this.config = {
        blog: {
          title: 'AppaHouse Blog',
          description: 'A blog about web development and modern technologies',
          author: 'AppaHouse Team'
        }
      };
    }
  }

  // Load blog posts from markdown files
  async loadBlogPosts() {
    try {
      // If we have a config, use it to get the posts directory
      const postsDirectory = this.config?.blog?.postsDirectory || 'blog';
      
      // Try to get the list of blog posts from the server
      let blogFiles = [];
      
      try {
        // First, try to get a list of files from the server
        const response = await fetch(`${postsDirectory}/index.json`);
        if (response.ok) {
          blogFiles = await response.json();
        } else {
          // Fallback to hardcoded list
          blogFiles = [
            'getting-started-with-tanstack-start.md',
            'dockerizing-a-tanstack-start-application.md',
            'implementing-real-time-features-with-websockets.md'
          ];
        }
      } catch (error) {
        // If fetching the index fails, use the hardcoded list
        blogFiles = [
          'getting-started-with-tanstack-start.md',
          'dockerizing-a-tanstack-start-application.md',
          'implementing-real-time-features-with-websockets.md'
        ];
      }

      // Process each blog post
      this.blogPosts = await Promise.all(blogFiles.map(async (filename) => {
        // Extract post ID from filename
        const postId = filename.replace('.md', '');
        
        // Fetch the markdown content
        const content = await this.fetchMarkdownFile(filename);
        
        // Parse frontmatter and content
        const { frontmatter, markdownContent } = this.parseFrontmatter(content);
        
        // Calculate read time (rough estimate: 200 words per minute)
        const wordCount = markdownContent.split(/\s+/).length;
        const readTime = frontmatter.readTime || `${Math.ceil(wordCount / 200)} min read`;
        
        return {
          id: postId,
          title: frontmatter.title || 'Untitled Post',
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          excerpt: frontmatter.excerpt || '',
          tags: frontmatter.tags || [],
          readTime,
          category: frontmatter.category || '',
          author: frontmatter.author || this.config?.blog?.author || 'AppaHouse Team',
          featuredImage: frontmatter.featuredImage || '',
          published: frontmatter.published !== false, // Default to true
          content: markdownContent
        };
      }));
      
      // Filter out unpublished posts
      this.blogPosts = this.blogPosts.filter(post => post.published);
      
      // Sort posts by date (newest first)
      this.blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  }

  // Fetch markdown file content
  async fetchMarkdownFile(filename) {
    try {
      const response = await fetch(`blog/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching ${filename}:`, error);
      return `# Error loading post\n\nCould not load the blog post "${filename}". Please try again later.`;
    }
  }

  // Parse frontmatter from markdown content
  parseFrontmatter(markdown) {
    // Check if the content starts with frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (match) {
      const frontmatterText = match[1];
      const content = match[2];
      
      // Parse YAML frontmatter
      const frontmatter = this.parseYaml(frontmatterText);
      
      return { frontmatter, markdownContent: content };
    }
    
    // No frontmatter found
    return { frontmatter: {}, markdownContent: markdown };
  }

  // Simple YAML parser for frontmatter
  parseYaml(yamlText) {
    const result = {};
    const lines = yamlText.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2];
        
        // Handle quoted values
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Handle array values
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1)
            .split(',')
            .map(item => item.trim().replace(/^["']|["']$/g, ''));
        }
        
        result[key] = value;
      }
    }
    
    return result;
  }

  // Render blog posts
  renderBlogPosts() {
    if (!this.blogContainer || this.blogPosts.length === 0) {
      return;
    }

    let html = '';
    
    this.blogPosts.forEach(post => {
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      html += `
        <article class="card overflow-hidden">
          ${post.featuredImage ? `
            <div class="h-48 bg-gray-200 dark:bg-gray-700">
              <img src="${post.featuredImage}" alt="${post.title}" class="w-full h-full object-cover">
            </div>
          ` : `
            <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400">Blog Post Image</span>
            </div>
          `}
          <div class="p-6">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <time>${formattedDate}</time> · ${post.readTime}
              ${post.author ? ` · By ${post.author}` : ''}
              ${post.category ? ` · ${post.category}` : ''}
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              <a href="#blog/${post.id}" class="hover:text-primary-600 dark:hover:text-primary-400">
                ${post.title}
              </a>
            </h3>
            <p class="text-base text-gray-500 dark:text-gray-400 mb-4">
              ${post.excerpt}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              ${post.tags.map(tag => `
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  ${tag}
                </span>
              `).join('')}
            </div>
            <a href="#blog/${post.id}" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Read more →
            </a>
          </div>
        </article>
      `;
    });
    
    this.blogContainer.innerHTML = html;
  }

  // Get a single blog post by ID
  getBlogPost(id) {
    return this.blogPosts.find(post => post.id === id);
  }

  // Render a single blog post
  renderBlogPost(id, container) {
    const post = this.getBlogPost(id);
    
    if (!post || !container) {
      return;
    }

    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Enhanced markdown to HTML converter with better styling
    const contentHtml = this.markdownToHtml(post.content);
    
    container.innerHTML = `
      <article class="prose prose-lg max-w-none dark:prose-invert">
        <header class="mb-8">
          ${post.featuredImage ? `
            <div class="mb-6">
              <img src="${post.featuredImage}" alt="${post.title}" class="w-full h-64 object-cover rounded-lg">
            </div>
          ` : ''}
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${post.title}</h1>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <time>${formattedDate}</time> · ${post.readTime}
            ${post.author ? ` · By ${post.author}` : ''}
            ${post.category ? ` · ${post.category}` : ''}
          </div>
          <div class="flex flex-wrap gap-2">
            ${post.tags.map(tag => `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                ${tag}
              </span>
            `).join('')}
          </div>
        </header>
        
        <div class="blog-content">
          ${contentHtml}
        </div>
        
        <footer class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <button onclick="window.location.href='index.html#blog'" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              ← Back to all posts
            </button>
            <div class="flex gap-4">
              ${this.renderSocialShareButtons(post)}
            </div>
          </div>
        </footer>
      </article>
    `;
    
    // Add copy code functionality
    this.addCopyCodeFunctionality(container);
    
    // Add table of contents if enabled
    this.addTableOfContents(container);
    
    // Add smooth scrolling for anchor links
    this.addSmoothScrolling(container);
  }

  // Render social share buttons
  renderSocialShareButtons(post) {
    if (!this.config?.features?.socialSharing) {
      return '';
    }
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    return `
      <div class="flex gap-2">
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
        <a href="https://github.com/${this.config?.social?.github?.replace('https://github.com/', '')}" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
          </svg>
        </a>
      </div>
    `;
  }

  // Add table of contents functionality
  addTableOfContents(container) {
    const tocContainer = container.querySelector('.table-of-contents');
    if (!tocContainer) return;
    
    const headings = container.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) return;
    
    let tocHtml = '<nav class="table-of-contents mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"><h3 class="text-lg font-semibold mb-4">Table of Contents</h3><ul class="space-y-2">';
    
    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      const level = parseInt(heading.tagName.substring(1));
      const indent = (level - 2) * 16; // Indent based on heading level
      
      tocHtml += `<li style="margin-left: ${indent}px"><a href="#${id}" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">${heading.textContent}</a></li>`;
    });
    
    tocHtml += '</ul></nav>';
    
    // Insert the table of contents after the header
    const header = container.querySelector('header');
    if (header) {
      header.insertAdjacentHTML('afterend', tocHtml);
    }
  }

  // Add smooth scrolling for anchor links
  addSmoothScrolling(container) {
    const links = container.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Enhanced markdown to HTML converter with better formatting
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-semibold mt-10 mb-5 text-gray-900 dark:text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">$1</h1>');
    
    // Code blocks with syntax highlighting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      const escapedCode = this.escapeHtml(code.trim());
      return `<div class="relative my-6">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono rounded-t-lg">
          <span class="text-xs">${language}</span>
          <button class="copy-code-btn text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors" data-code="${escapedCode.replace(/"/g, '"')}">Copy</button>
        </div>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code class="language-${language}">${escapedCode}</code></pre>
      </div>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]*)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300">$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-200 dark:border-gray-700">');
    
    // Lists (both ordered and unordered)
    html = this.processLists(html);
    
    // Process paragraphs
    html = this.processParagraphs(html);
    
    return html;
  }

  // Process lists in markdown
  processLists(html) {
    // Split by lines to process lists
    const lines = html.split('\n');
    let inList = false;
    let listType = null;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Check for unordered list item
      if (trimmed.match(/^[-*+] /)) {
        if (!inList || listType !== 'ul') {
          if (inList) {
            result.push(`</${listType}>`);
          }
          result.push('<ul class="list-disc list-inside my-4 space-y-2">');
          inList = true;
          listType = 'ul';
        }
        const content = trimmed.replace(/^[-*+] /, '');
        result.push(`<li class="text-gray-700 dark:text-gray-300">${content}</li>`);
      }
      // Check for ordered list item
      else if (trimmed.match(/^\d+\. /)) {
        if (!inList || listType !== 'ol') {
          if (inList) {
            result.push(`</${listType}>`);
          }
          result.push('<ol class="list-decimal list-inside my-4 space-y-2">');
          inList = true;
          listType = 'ol';
        }
        const content = trimmed.replace(/^\d+\. /, '');
        result.push(`<li class="text-gray-700 dark:text-gray-300">${content}</li>`);
      }
      // Not a list item
      else {
        if (inList) {
          result.push(`</${listType}>`);
          inList = false;
          listType = null;
        }
        result.push(line);
      }
    }
    
    // Close any open list
    if (inList) {
      result.push(`</${listType}>`);
    }
    
    return result.join('\n');
  }

  // Process paragraphs
  processParagraphs(html) {
    // Split by double newlines to identify potential paragraphs
    const blocks = html.split('\n\n');
    const result = [];
    
    for (const block of blocks) {
      const trimmed = block.trim();
      
      // Skip empty blocks
      if (!trimmed) continue;
      
      // Skip if it's already an HTML block element
      if (trimmed.startsWith('<h') ||
          trimmed.startsWith('<ul') ||
          trimmed.startsWith('<ol') ||
          trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<hr') ||
          trimmed.startsWith('<div')) {
        result.push(block);
      } else {
        // Wrap in paragraph tags
        result.push(`<p class="my-4 text-gray-700 dark:text-gray-300 leading-relaxed">${trimmed}</p>`);
      }
    }
    
    return result.join('\n\n');
  }

  // Escape HTML entities
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Add copy code functionality to code blocks
  addCopyCodeFunctionality(container) {
    const copyButtons = container.querySelectorAll('.copy-code-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const code = button.getAttribute('data-code');
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
          // Update button text
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.classList.add('bg-green-600');
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy code: ', err);
        });
      });
    });
  }
}

// Initialize the blog renderer when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const blogRenderer = new BlogRenderer();
  blogRenderer.init();
  
  // Handle single blog post view
  const blogPostContainer = document.getElementById('blog-post');
  if (blogPostContainer) {
    // Extract post ID from URL hash
    const hash = window.location.hash;
    const postId = hash.replace('#blog/', '');
    
    if (postId) {
      blogRenderer.renderBlogPost(postId, blogPostContainer);
    }
  }
});