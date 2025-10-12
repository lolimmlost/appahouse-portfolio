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
    const technologies = project.technologies.slice(0, 3).map(tech =>
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 transition-all duration-200 hover:scale-105">
        ${tech}
      </span>`
    ).join('');

    const extraTechCount = project.technologies.length > 3 ? project.technologies.length - 3 : 0;

    return `
      <div class="project-card card overflow-hidden group" data-project-id="${project.id}">
        <div class="relative h-56 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          <img src="${project.thumbnail}" alt="${project.title}" class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="hidden absolute inset-0 items-center justify-center text-gray-400 dark:text-gray-500">
            <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>

          ${project.featured ? `
            <div class="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Featured
            </div>
          ` : ''}

          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div class="p-6">
          <div class="mb-3">
            <span class="inline-block text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded">
              ${project.category || 'Project'}
            </span>
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            ${project.title}
          </h3>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            ${project.description}
          </p>

          <div class="flex flex-wrap gap-2 mb-4">
            ${technologies}
            ${extraTechCount > 0 ? `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                +${extraTechCount} more
              </span>
            ` : ''}
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              ${new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>

            <div class="flex items-center gap-2">
              <a href="project.html?id=${project.id}" class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 group/link">
                View Details
                <svg class="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
              ${project.liveDemo ? `
                <a href="${project.liveDemo.startsWith('http') ? project.liveDemo : 'https://' + project.liveDemo}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 transition-all duration-200 hover:scale-110" title="Live Demo">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
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