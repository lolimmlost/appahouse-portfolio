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
      `<span class="inline-flex items-center px-3 py-1 text-xs font-bold bg-white dark:bg-gray-700 border-2 border-black text-gray-900 dark:text-white uppercase tracking-wide shadow-brutal-sm transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
        ${tech}
      </span>`
    ).join('');

    return `
      <div class="bg-white dark:bg-gray-900 border-4 border-black shadow-brutal overflow-hidden transform transition-all duration-300 hover:translate-x-2 hover:translate-y-2 hover:shadow-none">
        <div class="md:flex">
          <div class="md:shrink-0 relative group">
            <div class="h-64 w-full object-cover md:h-full md:w-80 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden border-r-4 border-black">
              <img src="${caseStudy.thumbnail}" alt="${caseStudy.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="hidden text-gray-400 dark:text-gray-500">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
            ${caseStudy.featured ? `
              <div class="absolute top-4 right-4 bg-primary-400 text-black text-xs font-black px-3 py-1.5 border-3 border-black shadow-brutal-sm uppercase tracking-wide flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Featured
              </div>
            ` : ''}
          </div>
          <div class="p-8 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <span class="uppercase tracking-wide text-xs text-black dark:text-white font-black px-3 py-1.5 bg-primary-400 dark:bg-primary-500 border-2 border-black">
                  ${caseStudy.category}
                </span>
                ${caseStudy.client ? `
                  <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    ${caseStudy.client}
                  </span>
                ` : ''}
              </div>

              <a href="case-study.html?id=${caseStudy.id}" class="block mt-2 text-2xl leading-tight font-black text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400 transition-colors duration-200 uppercase tracking-tight">
                ${caseStudy.title}
              </a>

              <p class="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                ${caseStudy.excerpt || caseStudy.challenge?.substring(0, 150) + '...' || 'View the full case study to learn more about this project.'}
              </p>

              <div class="mt-5 flex flex-wrap gap-2">
                ${technologies}
              </div>
            </div>

            <div class="mt-6 pt-6 border-t-3 border-black">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wide">
                  <span class="inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    ${new Date(caseStudy.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  ${caseStudy.developmentTime ? `
                    <span class="inline-flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      ${caseStudy.developmentTime}
                    </span>
                  ` : ''}
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <a href="case-study.html?id=${caseStudy.id}" class="btn btn-primary flex items-center gap-2 group">
                  Read Case Study
                  <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </a>
                ${caseStudy.liveDemo ? `
                  <a href="${caseStudy.liveDemo.startsWith('http') ? caseStudy.liveDemo : 'https://' + caseStudy.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary flex items-center gap-2 group">
                    Live Demo
                    <svg class="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                ` : ''}
              </div>
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