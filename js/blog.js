// Blog functionality and navigation
class BlogManager {
  constructor() {
    this.blogRenderer = null;
    this.currentPost = null;
    this.posts = [];
  }

  // Initialize the blog manager
  async init() {
    // Initialize the blog renderer
    this.blogRenderer = new BlogRenderer();
    await this.blogRenderer.init();
    
    // Get the blog posts
    this.posts = this.blogRenderer.blogPosts;
    
    // Set up navigation handling
    this.setupNavigation();
    
    // Handle the current page view
    this.handleCurrentView();
  }

  // Set up navigation handling for blog routes
  setupNavigation() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleCurrentView();
    });
    
    // Handle initial page load
    document.addEventListener('DOMContentLoaded', () => {
      this.handleCurrentView();
    });
  }

  // Handle the current view based on URL hash
  handleCurrentView() {
    const hash = window.location.hash;
    
    // Check if we're viewing a specific blog post
    if (hash.startsWith('#blog/')) {
      const postId = hash.replace('#blog/', '');
      this.showBlogPost(postId);
    } 
    // Check if we're on the blog page
    else if (hash === '#blog' || document.getElementById('blog-posts')) {
      this.showBlogList();
    }
  }

  // Show a specific blog post
  async showBlogPost(postId) {
    try {
      // Check if we're on the blog-post.html page
      if (window.location.pathname.includes('blog-post.html')) {
        // We're already on the blog post page
        const container = document.getElementById('blog-post');
        if (container) {
          await this.blogRenderer.renderBlogPost(postId, container);
          this.currentPost = postId;
        }
      } else {
        // Navigate to the blog post page
        window.location.href = `blog-post.html#blog/${postId}`;
      }
    } catch (error) {
      console.error('Error showing blog post:', error);
      this.showError('Failed to load blog post. Please try again later.');
    }
  }

  // Show the blog list
  showBlogList() {
    // If we're on a dedicated blog page, render the list
    const container = document.getElementById('blog-posts');
    if (container) {
      this.blogRenderer.renderBlogPosts();
    }
  }

  // Show an error message
  showError(message) {
    const container = document.getElementById('blog-post') || document.getElementById('blog-posts');
    if (container) {
      container.innerHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div class="text-red-600 dark:text-red-400 text-lg font-medium mb-2">Error</div>
          <div class="text-red-500 dark:text-red-300">${message}</div>
          <button onclick="window.location.hash='#blog'" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Back to Blog
          </button>
        </div>
      `;
    }
  }

  // Get related posts based on tags
  getRelatedPosts(currentPostId, limit = 3) {
    const currentPost = this.posts.find(post => post.id === currentPostId);
    if (!currentPost) return [];

    // Find posts with similar tags
    const relatedPosts = this.posts
      .filter(post => {
        if (post.id === currentPostId) return false;
        
        // Check if post shares any tags with the current post
        return currentPost.tags.some(tag => post.tags.includes(tag));
      })
      .sort((a, b) => {
        // Sort by the number of shared tags (descending)
        const aSharedTags = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
        const bSharedTags = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
        
        if (aSharedTags !== bSharedTags) {
          return bSharedTags - aSharedTags;
        }
        
        // If same number of shared tags, sort by date (newest first)
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, limit);

    return relatedPosts;
  }

  // Render related posts
  renderRelatedPosts(currentPostId, container) {
    const relatedPosts = this.getRelatedPosts(currentPostId);
    
    if (relatedPosts.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = `
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Related Posts</h3>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    `;

    relatedPosts.forEach(post => {
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      html += `
        <article class="card">
          <div class="p-4">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <time>${formattedDate}</time> · ${post.readTime}
            </div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              <a href="#blog/${post.id}" class="hover:text-primary-600 dark:hover:text-primary-400">
                ${post.title}
              </a>
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              ${post.excerpt}
            </p>
            <a href="#blog/${post.id}" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Read more →
            </a>
          </div>
        </article>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // Search blog posts
  searchPosts(query) {
    if (!query.trim()) {
      return this.posts;
    }

    const lowercaseQuery = query.toLowerCase();
    
    return this.posts.filter(post => {
      // Search in title
      if (post.title.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in excerpt
      if (post.excerpt.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      // Search in tags
      if (post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) {
        return true;
      }
      
      // Search in content (limited to avoid performance issues)
      if (post.content.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }
      
      return false;
    });
  }

  // Filter posts by tag
  filterPostsByTag(tag) {
    return this.posts.filter(post => 
      post.tags.includes(tag)
    );
  }

  // Get all unique tags
  getAllTags() {
    const tags = new Set();
    
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tags.add(tag);
      });
    });
    
    return Array.from(tags).sort();
  }
}

// Initialize the blog manager
const blogManager = new BlogManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogManager;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    blogManager.init();
  });
}