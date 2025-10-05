/**
 * Projects Showcase Module
 * Handles project filtering, searching, and display functionality
 */

class ProjectsShowcase {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.activeFilters = new Set();
    this.searchTerm = '';
    this.sortBy = 'recent'; // recent, featured, technology
    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      this.setupEventListeners();
      this.renderProjects();
      this.renderFilterOptions();
    } catch (error) {
      console.error('Error initializing projects showcase:', error);
      this.showError('Failed to load projects. Please try again later.');
    }
  }

  async loadProjects() {
    try {
      const response = await fetch('./projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data.projects || [];
      this.filteredProjects = [...this.projects];
    } catch (error) {
      console.error('Error loading projects:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    // Sort functionality
    const sortSelect = document.getElementById('project-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Filter functionality
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('project-filter')) {
        const technology = e.target.dataset.technology;
        this.toggleFilter(technology);
      }
    });

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }

  toggleFilter(technology) {
    if (this.activeFilters.has(technology)) {
      this.activeFilters.delete(technology);
    } else {
      this.activeFilters.add(technology);
    }
    this.updateFilterUI();
    this.applyFilters();
  }

  clearFilters() {
    this.activeFilters.clear();
    this.searchTerm = '';
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.value = '';
    }
    this.updateFilterUI();
    this.applyFilters();
  }

  updateFilterUI() {
    // Update filter button states
    document.querySelectorAll('.project-filter').forEach(btn => {
      const technology = btn.dataset.technology;
      if (this.activeFilters.has(technology)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update clear filters button visibility
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.style.display = this.activeFilters.size > 0 ? 'block' : 'none';
    }
  }

  applyFilters() {
    // Start with all projects
    this.filteredProjects = [...this.projects];

    // Apply search filter
    if (this.searchTerm) {
      this.filteredProjects = this.filteredProjects.filter(project => 
        project.title.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.category.toLowerCase().includes(this.searchTerm) ||
        project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm))
      );
    }

    // Apply technology filters
    if (this.activeFilters.size > 0) {
      this.filteredProjects = this.filteredProjects.filter(project =>
        project.technologies.some(tech => this.activeFilters.has(tech))
      );
    }

    // Apply sorting
    this.sortProjects();

    // Render the filtered projects
    this.renderProjects();
  }

  sortProjects() {
    switch (this.sortBy) {
      case 'recent':
        this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'featured':
        this.filteredProjects.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date) - new Date(a.date);
        });
        break;
      case 'technology':
        this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    if (this.filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">No projects found matching your criteria.</p>
          <button id="reset-filters" class="mt-4 btn btn-secondary">Reset Filters</button>
        </div>
      `;
      
      // Add event listener to reset button
      const resetBtn = document.getElementById('reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.clearFilters());
      }
      return;
    }

    container.innerHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');

    // Add event listeners to project cards
    this.attachProjectCardListeners();
  }

  createProjectCard(project) {
    const technologies = project.technologies.map(tech => 
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
        ${tech}
      </span>`
    ).join('');

    return `
      <div class="project-card card overflow-hidden" data-project-id="${project.id}">
        <div class="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden group">
          <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
          ${project.featured ? '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Featured</div>' : ''}
        </div>
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">${project.title}</h3>
          <p class="text-base text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${technologies}
          </div>
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${new Date(project.date).toLocaleDateString()}
              </span>
            </div>
            <div class="flex space-x-3">
              <a href="project.html?id=${project.id}" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                View Details
              </a>
              ${project.liveDemo ? `
                <a href="${project.liveDemo}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Live Demo
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachProjectCardListeners() {
    // Add any additional event listeners for project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });
  }

  renderFilterOptions() {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;

    // Get all unique technologies from projects
    const allTechnologies = [...new Set(this.projects.flatMap(project => project.technologies))];
    
    const filterHTML = allTechnologies.map(tech => `
      <button class="project-filter px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors" data-technology="${tech}">
        ${tech}
      </button>
    `).join('');

    filterContainer.innerHTML = `
      <div class="flex flex-wrap gap-2">
        ${filterHTML}
        <button id="clear-filters" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" style="display: none;">
          Clear Filters
        </button>
      </div>
    `;
  }

  showError(message) {
    const container = document.getElementById('projects-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-lg">${message}</p>
        </div>
      `;
    }
  }

  // Public method to get project by ID
  getProjectById(id) {
    return this.projects.find(project => project.id === id);
  }

  // Public method to get related projects
  getRelatedProjects(currentProjectId, limit = 3) {
    const currentProject = this.getProjectById(currentProjectId);
    if (!currentProject) return [];

    return this.projects
      .filter(project => project.id !== currentProjectId)
      .filter(project => 
        project.technologies.some(tech => currentProject.technologies.includes(tech)) ||
        project.category === currentProject.category
      )
      .slice(0, limit);
  }
}

// Initialize the projects showcase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.projectsShowcase = new ProjectsShowcase();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectsShowcase;
}