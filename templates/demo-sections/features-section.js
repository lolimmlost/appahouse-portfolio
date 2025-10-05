/**
 * Features Section Template
 * A section for showcasing demo features and capabilities
 */

class FeaturesSection {
  constructor(options = {}) {
    this.options = {
      title: 'Key Features',
      subtitle: 'Explore the capabilities',
      description: 'Discover what makes this demo special',
      features: [],
      layout: 'grid', // grid, list, or carousel
      columns: 3, // for grid layout
      showIcons: true,
      backgroundColor: 'bg-white dark:bg-gray-900',
      accentColor: 'primary',
      ...options
    };
  }

  /**
   * Generate HTML for the features section
   */
  generateHTML() {
    const layoutClass = this.getLayoutClass();
    const columnsClass = this.getColumnsClass();

    return `
      <section class="features-section ${this.options.backgroundColor} py-16">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Section Header -->
          <div class="max-w-3xl mx-auto text-center mb-12">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
              ${this.options.title}
            </h2>
            
            ${this.options.subtitle ? `
              <p class="text-xl text-${this.options.accentColor}-600 dark:text-${this.options.accentColor}-400 mb-4">
                ${this.options.subtitle}
              </p>
            ` : ''}
            
            <p class="text-lg text-gray-500 dark:text-gray-400">
              ${this.options.description}
            </p>
          </div>

          <!-- Features Grid/List -->
          <div class="max-w-6xl mx-auto">
            <div class="${layoutClass} ${columnsClass} gap-8">
              ${this.options.features.map((feature, index) => this.generateFeatureHTML(feature, index)).join('')}
            </div>
          </div>

          <!-- Additional CTA -->
          <div class="mt-12 text-center">
            <a href="#demo" class="btn btn-${this.options.accentColor} btn-lg">
              Try the Demo
            </a>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generate HTML for a single feature
   */
  generateFeatureHTML(feature, index) {
    const animationDelay = index * 100;
    
    return `
      <div class="feature-item" style="animation-delay: ${animationDelay}ms">
        <div class="h-full p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          ${this.options.showIcons && feature.icon ? `
            <div class="text-${this.options.accentColor}-600 dark:text-${this.options.accentColor}-400 mb-4">
              ${this.generateIconHTML(feature.icon)}
            </div>
          ` : ''}
          
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            ${feature.title}
          </h3>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            ${feature.description}
          </p>
          
          ${feature.highlights ? `
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              ${feature.highlights.map(highlight => `
                <li class="flex items-start">
                  <svg class="w-4 h-4 text-${this.options.accentColor}-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  ${highlight}
                </li>
              `).join('')}
            </ul>
          ` : ''}
          
          ${feature.link ? `
            <div class="mt-4">
              <a href="${feature.link}" class="text-${this.options.accentColor}-600 hover:text-${this.options.accentColor}-500 dark:text-${this.options.accentColor}-400 dark:hover:text-${this.options.accentColor}-300 font-medium text-sm inline-flex items-center">
                Learn more
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generate icon HTML based on icon name
   */
  generateIconHTML(iconName) {
    const icons = {
      'zap': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>`,
      'clock': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`,
      'shield': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>`,
      'rocket': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>`,
      'gear': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>`,
      'code': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
      </svg>`,
      'mobile': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>`,
      'cloud': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>`
    };

    return icons[iconName] || icons['gear'];
  }

  /**
   * Get layout class based on layout option
   */
  getLayoutClass() {
    switch (this.options.layout) {
      case 'list':
        return 'space-y-6';
      case 'carousel':
        return 'flex overflow-x-auto space-x-6 pb-4';
      case 'grid':
      default:
        return 'grid';
    }
  }

  /**
   * Get columns class for grid layout
   */
  getColumnsClass() {
    switch (this.options.columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    }
  }

  /**
   * Generate CSS for the features section
   */
  generateCSS() {
    return `
      .feature-item {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .features-section .feature-item:hover {
        transform: translateY(-5px);
        transition: transform 0.3s ease;
      }
      
      .features-section .feature-item h3 {
        transition: color 0.3s ease;
      }
      
      .features-section .feature-item:hover h3 {
        color: rgb(var(--tw-color-${this.options.accentColor}-600));
      }
      
      @media (max-width: 768px) {
        .features-section {
          padding: 3rem 0;
        }
        
        .feature-item {
          animation-delay: 0ms !important;
        }
      }
    `;
  }

  /**
   * Generate JavaScript for the features section
   */
  generateJS() {
    return `
      // Features section functionality
      document.addEventListener('DOMContentLoaded', function() {
        // Intersection Observer for animations
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = 'running';
            }
          });
        }, observerOptions);
        
        // Observe all feature items
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach(item => {
          item.style.animationPlayState = 'paused';
          observer.observe(item);
        });
        
        // Smooth scroll for CTA links
        const ctaLink = document.querySelector('.features-section a[href="#demo"]');
        if (ctaLink) {
          ctaLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#demo');
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        }
      });
    `;
  }

  /**
   * Get the complete section code
   */
  getSectionCode() {
    return {
      html: this.generateHTML(),
      css: this.generateCSS(),
      js: this.generateJS()
    };
  }
}

module.exports = FeaturesSection;