/**
 * Case Studies Module
 * Handles case study display and functionality
 */

class CaseStudiesManager {
  constructor() {
    this.caseStudies = [];
    this.init();
  }

  async init() {
    try {
      await this.loadCaseStudies();
      this.renderCaseStudies();
    } catch (error) {
      console.error('Error initializing case studies:', error);
      this.showError('Failed to load case studies. Please try again later.');
    }
  }

  async loadCaseStudies() {
    try {
      const response = await fetch('./case-studies.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.caseStudies = data.caseStudies || [];
    } catch (error) {
      console.error('Error loading case studies:', error);
      throw error;
    }
  }

  renderCaseStudies() {
    const container = document.getElementById('case-studies-container');
    if (!container) return;

    if (this.caseStudies.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">No case studies available at the moment.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.caseStudies.map(caseStudy => this.createCaseStudyCard(caseStudy)).join('');
  }

  createCaseStudyCard(caseStudy) {
    const technologies = caseStudy.technologies.map(tech => 
      `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
        ${tech}
      </span>`
    ).join('');

    return `
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:shrink-0">
            <div class="h-48 w-full object-cover md:h-full md:w-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <img src="${caseStudy.thumbnail}" alt="${caseStudy.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="hidden text-gray-500 dark:text-gray-400">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="uppercase tracking-wide text-sm text-primary-600 dark:text-primary-400 font-semibold">
              ${caseStudy.category}
            </div>
            <a href="case-study.html?id=${caseStudy.id}" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline dark:text-white">
              ${caseStudy.title}
            </a>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              ${caseStudy.excerpt}
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              ${technologies}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span class="inline-flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${new Date(caseStudy.date).toLocaleDateString()}
              </span>
            </div>
            <div class="flex flex-wrap gap-3">
              <a href="case-study.html?id=${caseStudy.id}" class="btn btn-primary">Read Case Study</a>
              ${caseStudy.liveDemo ? `
                <a href="${caseStudy.liveDemo.startsWith('http') ? caseStudy.liveDemo : 'https://' + caseStudy.liveDemo}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Live Demo
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showError(message) {
    const container = document.getElementById('case-studies-container');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12">
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

  // Public method to get case study by ID
  getCaseStudyById(id) {
    return this.caseStudies.find(caseStudy => caseStudy.id === id);
  }

  // Public method to get related case studies
  getRelatedCaseStudies(currentCaseStudyId, limit = 2) {
    const currentCaseStudy = this.getCaseStudyById(currentCaseStudyId);
    if (!currentCaseStudy) return [];

    return this.caseStudies
      .filter(caseStudy => caseStudy.id !== currentCaseStudyId)
      .filter(caseStudy => 
        caseStudy.technologies.some(tech => currentCaseStudy.technologies.includes(tech)) ||
        caseStudy.category === currentCaseStudy.category
      )
      .slice(0, limit);
  }
}

// Initialize the case studies manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.caseStudiesManager = new CaseStudiesManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CaseStudiesManager;
}