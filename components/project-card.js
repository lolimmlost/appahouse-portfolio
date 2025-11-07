/**
 * Project Card Component
 * Reusable component for displaying project information in card format
 */

class ProjectCard {
  constructor(container, project, options = {}) {
    this.container = container;
    this.project = project;
    this.options = {
      showDetails: true,
      showTechnologies: true,
      showDate: true,
      showFeaturedBadge: true,
      imageLoadingStrategy: 'lazy',
      ...options
    };
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const cardHTML = this.createCardHTML();
    this.container.innerHTML = cardHTML;
  }

  createCardHTML() {
    const {
      id,
      title,
      description,
      thumbnail,
      featured,
      date,
      technologies,
      liveDemo,
      repository
    } = this.project;

    const technologiesHTML = this.options.showTechnologies 
      ? this.createTechnologiesHTML(technologies)
      : '';

    const dateHTML = this.options.showDate 
      ? this.createDateHTML(date)
      : '';

    const featuredBadgeHTML = this.options.showFeaturedBadge && featured
      ? '<div class="absolute top-3 right-3 bg-primary-400 border-3 border-black text-black text-xs px-3 py-1.5 font-black uppercase tracking-wide shadow-brutal-sm">Featured</div>'
      : '';

    const actionButtonsHTML = this.createActionButtonsHTML(liveDemo, repository);

    return `
      <div class="project-card card overflow-hidden group transition-all duration-200" data-project-id="${id}">
        <div class="relative h-52 bg-gray-200 dark:bg-gray-700 overflow-hidden border-b-4 border-black">
          <img
            src="${thumbnail}"
            alt="${title}"
            class="w-full h-full object-cover"
            loading="${this.options.imageLoadingStrategy}"
            onerror="this.src='/assets/images/placeholder.jpg'"
          >
          ${featuredBadgeHTML}
          <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="absolute bottom-4 left-4 right-4 flex gap-2">
              ${actionButtonsHTML}
            </div>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-1 uppercase tracking-tight">${title}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 font-medium">${description}</p>
          ${technologiesHTML}
          <div class="flex justify-between items-center mt-5">
            ${dateHTML}
            <div class="flex space-x-3">
              <a href="project.html?id=${id}" class="text-xs font-black text-black dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase border-b-2 border-black dark:border-white hover:border-primary-600 dark:hover:border-primary-400">
                View Details →
              </a>
              ${liveDemo ? `
                <a href="${liveDemo}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-black dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase border-b-2 border-black dark:border-white hover:border-primary-600 dark:hover:border-primary-400">
                  Live Demo →
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createTechnologiesHTML(technologies) {
    if (!technologies || technologies.length === 0) return '';

    const techList = technologies.slice(0, 4).map(tech =>
      `<span class="inline-flex items-center px-3 py-1 border-2 border-black text-xs font-bold bg-primary-100 text-black dark:bg-primary-900 dark:text-white dark:border-gray-600 uppercase">
        ${tech}
      </span>`
    ).join('');

    const moreTechHTML = technologies.length > 4
      ? `<span class="inline-flex items-center px-3 py-1 border-2 border-black text-xs font-bold bg-gray-100 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 uppercase">
        +${technologies.length - 4}
      </span>`
      : '';

    return `
      <div class="flex flex-wrap gap-2 mb-4">
        ${techList}
        ${moreTechHTML}
      </div>
    `;
  }

  createDateHTML(date) {
    if (!date) return '';

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `
      <div class="text-xs text-gray-700 dark:text-gray-300">
        <span class="inline-flex items-center font-bold uppercase">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="square" stroke-linejoin="miter" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          ${formattedDate}
        </span>
      </div>
    `;
  }

  createActionButtonsHTML(liveDemo, repository) {
    let buttonsHTML = '';

    if (liveDemo) {
      buttonsHTML += `
        <a href="${liveDemo}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-black text-black bg-primary-400 border-3 border-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wide">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="square" stroke-linejoin="miter" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Demo
        </a>
      `;
    }

    if (repository) {
      buttonsHTML += `
        <a href="${repository}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-black text-white bg-gray-800 border-3 border-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wide">
          <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Code
        </a>
      `;
    }

    return buttonsHTML || `
      <a href="project.html?id=${this.project.id}" class="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-xs font-black text-black bg-primary-400 border-3 border-black shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wide">
        View Details
      </a>
    `;
  }

  attachEventListeners() {
    const card = this.container.querySelector('.project-card');
    if (!card) return;

    // Add mouse enter/leave effects
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover');
      this.onHover();
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover');
      this.onHoverEnd();
    });

    // Add click handler for card body (excluding links)
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && !e.target.closest('a')) {
        window.location.href = `project.html?id=${this.project.id}`;
      }
    });

    // Add image load error handler
    const image = card.querySelector('img');
    if (image) {
      image.addEventListener('error', () => {
        image.src = '/assets/images/placeholder.jpg';
      });
    }
  }

  onHover() {
    // Custom hover behavior can be implemented here
    // This method can be overridden by extending the class
  }

  onHoverEnd() {
    // Custom hover end behavior can be implemented here
    // This method can be overridden by extending the class
  }

  // Method to update the project data
  updateProject(newProject) {
    this.project = { ...this.project, ...newProject };
    this.render();
    this.attachEventListeners();
  }

  // Method to update options
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.render();
    this.attachEventListeners();
  }

  // Static method to create multiple cards
  static createCards(container, projects, options = {}) {
    container.innerHTML = '';
    
    projects.forEach(project => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'project-card-container';
      container.appendChild(cardContainer);
      
      new ProjectCard(cardContainer, project, options);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectCard;
}