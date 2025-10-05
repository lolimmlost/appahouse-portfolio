/**
 * Hero Section Template
 * A hero section for demo pages with title, description, and call-to-action
 */

class HeroSection {
  constructor(options = {}) {
    this.options = {
      title: 'Demo Title',
      subtitle: 'Interactive Demo',
      description: 'Experience this interactive demonstration of our capabilities',
      backgroundImage: '',
      backgroundColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
      textColor: 'text-white',
      showCTA: true,
      ctaText: 'Try Demo',
      ctaUrl: '#demo',
      ...options
    };
  }

  /**
   * Generate HTML for the hero section
   */
  generateHTML() {
    const backgroundStyle = this.options.backgroundImage 
      ? `background-image: url('${this.options.backgroundImage}'); background-size: cover; background-position: center;`
      : '';

    return `
      <section class="hero-section relative ${this.options.backgroundColor} ${this.options.textColor} py-20">
        ${backgroundStyle ? `<div class="absolute inset-0 bg-black bg-opacity-40"></div>` : ''}
        
        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4">
              ${this.options.title}
            </h1>
            
            ${this.options.subtitle ? `
              <p class="text-xl md:text-2xl mb-6 opacity-90">
                ${this.options.subtitle}
              </p>
            ` : ''}
            
            <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-80">
              ${this.options.description}
            </p>
            
            ${this.options.showCTA ? `
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="${this.options.ctaUrl}" class="btn btn-primary btn-lg inline-flex items-center justify-center px-8 py-3 text-base font-medium">
                  ${this.options.ctaText}
                </a>
                <a href="#features" class="btn btn-secondary btn-lg inline-flex items-center justify-center px-8 py-3 text-base font-medium">
                  Learn More
                </a>
              </div>
            ` : ''}
          </div>
        </div>
        
        ${this.options.showCTA ? `
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="${this.options.ctaUrl}" class="text-white opacity-70 hover:opacity-100 transition-opacity">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </a>
          </div>
        ` : ''}
      </section>
    `;
  }

  /**
   * Generate CSS for the hero section
   */
  generateCSS() {
    return `
      .hero-section {
        min-height: 60vh;
        display: flex;
        align-items: center;
      }
      
      @media (min-width: 768px) {
        .hero-section {
          min-height: 80vh;
        }
      }
      
      .hero-section .btn {
        transition: all 0.3s ease;
      }
      
      .hero-section .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }
    `;
  }

  /**
   * Generate JavaScript for the hero section
   */
  generateJS() {
    return `
      // Hero section functionality
      document.addEventListener('DOMContentLoaded', function() {
        // Smooth scroll for CTA button
        const ctaButtons = document.querySelectorAll('.hero-section a[href^="#"]');
        ctaButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });
        
        // Parallax effect for hero background
        if (window.innerWidth > 768) {
          window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-section');
            if (hero) {
              hero.style.transform = \`translateY(\${scrolled * 0.5}px)\`;
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

module.exports = HeroSection;