/**
 * Skills Module
 * Handles dynamic skills display and functionality
 */

class SkillsManager {
  constructor() {
    this.skills = [];
    this.init();
  }

  async init() {
    try {
      await this.loadSkills();
      this.renderSkills();
      this.animateSkillBars();
    } catch (error) {
      console.error('Error initializing skills:', error);
      this.showError('Failed to load skills. Please try again later.');
    }
  }

  async loadSkills() {
    try {
      const response = await fetch('./skills.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.skills = data.skillCategories || [];
    } catch (error) {
      console.error('Error loading skills:', error);
      throw error;
    }
  }

  renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    if (this.skills.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">No skills available at the moment.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.skills.map(category => this.createSkillCategoryCard(category)).join('');
  }

  createSkillCategoryCard(category) {
    const skillsHTML = category.skills.map(skill => `
      <div class="skill-item" data-skill-level="${skill.level}">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span class="skill-icon" style="color: ${skill.color}">●</span>
            ${skill.name}
          </span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${skill.level}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="width: 0%; background-color: ${skill.color};" data-target-width="${skill.level}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="card p-6 transform transition-all duration-300 hover:scale-105">
        <div class="flex items-center gap-3 mb-6">
          ${this.getIconSVG(category.icon)}
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${category.title}</h3>
        </div>
        <div class="space-y-5">
          ${skillsHTML}
        </div>
      </div>
    `;
  }

  getIconSVG(iconType) {
    const icons = {
      code: `
        <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      `,
      server: `
        <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
        </svg>
      `,
      tool: `
        <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      `
    };

    return icons[iconType] || icons.code;
  }

  animateSkillBars() {
    // Intersection Observer to animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll('.skill-progress');
          skillBars.forEach((bar, index) => {
            setTimeout(() => {
              const targetWidth = bar.getAttribute('data-target-width');
              bar.style.width = targetWidth;
            }, index * 100); // Stagger animation
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
      observer.observe(skillsContainer);
    }
  }

  showError(message) {
    const container = document.getElementById('skills-container');
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
}

// Initialize the skills manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.skillsManager = new SkillsManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillsManager;
}
