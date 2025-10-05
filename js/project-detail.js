/**
 * Project Detail Page Script
 * Handles loading and displaying individual project information
 */

class ProjectDetail {
  constructor() {
    this.project = null;
    this.projectsShowcase = null;
    this.gallery = null;
    this.init();
  }

  async init() {
    try {
      // Load projects data
      await this.loadProjects();
      
      // Get project ID from URL
      const projectId = this.getProjectIdFromUrl();
      
      if (!projectId) {
        this.showError('No project ID specified');
        return;
      }

      // Load specific project
      await this.loadProject(projectId);
      
      // Render project content
      this.renderProject();
      
      // Initialize gallery
      this.initializeGallery();
      
      // Load related projects
      this.loadRelatedProjects();
      
      // Hide loading, show content
      this.showContent();
    } catch (error) {
      console.error('Error initializing project detail:', error);
      this.showError('Failed to load project details. Please try again later.');
    }
  }

  async loadProjects() {
    try {
      const response = await fetch('./projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projectsShowcase = {
        projects: data.projects || [],
        getProjectById: (id) => data.projects.find(p => p.id === id),
        getRelatedProjects: (currentId, limit = 3) => {
          const currentProject = data.projects.find(p => p.id === currentId);
          if (!currentProject) return [];
          
          return data.projects
            .filter(p => p.id !== currentId)
            .filter(p => 
              p.technologies.some(tech => currentProject.technologies.includes(tech)) ||
              p.category === currentProject.category
            )
            .slice(0, limit);
        }
      };
    } catch (error) {
      console.error('Error loading projects:', error);
      throw error;
    }
  }

  getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async loadProject(projectId) {
    this.project = this.projectsShowcase.getProjectById(projectId);
    
    if (!this.project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
  }

  renderProject() {
    if (!this.project) return;

    // Update page title
    document.title = `${this.project.title} - AppaHouse Portfolio`;

    // Update breadcrumb
    const breadcrumb = document.getElementById('project-breadcrumb');
    if (breadcrumb) {
      breadcrumb.textContent = this.project.title;
    }

    // Update project header
    this.renderProjectHeader();
    
    // Update project sections
    this.renderProjectSection('project-overview', this.project.overview);
    this.renderProjectSection('project-challenge', this.project.challenge);
    this.renderProjectSection('project-solution', this.project.solution);
    this.renderProjectSection('project-development-process', this.project.developmentProcess);
    this.renderProjectSection('project-technical-implementation', this.project.technicalImplementation);
    this.renderProjectSection('project-results', this.project.results);
    this.renderProjectSection('project-lessons', this.project.lessonsLearned);
    
    // Update statistics
    this.renderProjectStatistics();
  }

  renderProjectHeader() {
    // Title
    const titleElement = document.getElementById('project-title');
    if (titleElement) {
      titleElement.textContent = this.project.title;
    }

    // Date
    const dateElement = document.getElementById('project-date');
    if (dateElement) {
      const formattedDate = new Date(this.project.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateElement.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        ${formattedDate}
      `;
    }

    // Category
    const categoryElement = document.getElementById('project-category');
    if (categoryElement) {
      categoryElement.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
        ${this.project.category}
      `;
    }

    // Technologies
    const techElement = document.getElementById('project-technologies');
    if (techElement) {
      const technologies = this.project.technologies.map(tech => 
        `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
          ${tech}
        </span>`
      ).join('');
      techElement.innerHTML = technologies;
    }

    // Demo link
    const demoLink = document.getElementById('project-demo-link');
    if (demoLink) {
      if (this.project.liveDemo) {
        demoLink.href = this.project.liveDemo;
        demoLink.style.display = 'inline-flex';
      } else {
        demoLink.style.display = 'none';
      }
    }

    // Repository link
    const repoLink = document.getElementById('project-repo-link');
    if (repoLink) {
      if (this.project.repository) {
        repoLink.href = this.project.repository;
        repoLink.style.display = 'inline-flex';
      } else {
        repoLink.style.display = 'none';
      }
    }
  }

  renderProjectSection(elementId, content) {
    const element = document.getElementById(elementId);
    if (element && content) {
      // Convert markdown-style content to HTML (basic implementation)
      const htmlContent = this.markdownToHtml(content);
      element.innerHTML = htmlContent;
    }
  }

  markdownToHtml(markdown) {
    if (!markdown) return '';
    
    // Basic markdown to HTML conversion
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gm, '<p>$1</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      // Lists (basic)
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }

  renderProjectStatistics() {
    // Development time
    const devTimeElement = document.getElementById('stat-development-time');
    if (devTimeElement && this.project.developmentTime) {
      devTimeElement.textContent = this.project.developmentTime;
    }

    // Lines of code
    const locElement = document.getElementById('stat-lines-of-code');
    if (locElement && this.project.linesOfCode) {
      locElement.textContent = this.formatNumber(parseInt(this.project.linesOfCode));
    }

    // Technologies count
    const techCountElement = document.getElementById('stat-technologies-count');
    if (techCountElement && this.project.technologies) {
      techCountElement.textContent = this.project.technologies.length;
    }
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  initializeGallery() {
    if (!this.project.images || this.project.images.length === 0) return;

    const galleryContainer = document.getElementById('project-gallery');
    if (!galleryContainer) return;

    // Prepare images for gallery
    const galleryImages = this.project.images.map((img, index) => ({
      src: img,
      alt: `${this.project.title} - Image ${index + 1}`,
      caption: `${this.project.title} - Image ${index + 1}`
    }));

    // Initialize gallery
    this.gallery = new ProjectGallery(galleryContainer, galleryImages, {
      showThumbnails: true,
      showCaptions: true,
      enableKeyboard: true,
      enableSwipe: true,
      thumbnailSize: 'medium'
    });
  }

  loadRelatedProjects() {
    if (!this.project) return;

    const relatedProjects = this.projectsShowcase.getRelatedProjects(this.project.id, 3);
    const relatedContainer = document.getElementById('related-projects');
    
    if (!relatedContainer || relatedProjects.length === 0) return;

    // Create related project cards
    ProjectCard.createCards(relatedContainer, relatedProjects, {
      showDetails: true,
      showTechnologies: true,
      showDate: true,
      showFeaturedBadge: true
    });
  }

  showContent() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('project-content').classList.remove('hidden');
  }

  showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    
    const errorElement = document.querySelector('#error p');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  // Method to handle browser back/forward navigation
  handlePopState() {
    const projectId = this.getProjectIdFromUrl();
    if (projectId) {
      this.loadProject(projectId)
        .then(() => {
          this.renderProject();
          this.initializeGallery();
          this.loadRelatedProjects();
          this.showContent();
        })
        .catch(error => {
          console.error('Error loading project on navigation:', error);
          this.showError('Failed to load project details.');
        });
    }
  }
}

// Initialize the project detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const projectDetail = new ProjectDetail();
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    projectDetail.handlePopState();
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectDetail;
}