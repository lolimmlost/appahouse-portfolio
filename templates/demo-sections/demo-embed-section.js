/**
 * Demo Embed Section Template
 * A section for embedding interactive demos with iframe support
 */

class DemoEmbedSection {
  constructor(options = {}) {
    this.options = {
      title: 'Interactive Demo',
      description: 'Try out this interactive demonstration',
      embedUrl: '',
      fullscreenUrl: '',
      thumbnail: '',
      aspectRatio: '16:9',
      showControls: true,
      showFullscreen: true,
      technologies: [],
      backgroundColor: 'bg-gray-50 dark:bg-gray-800',
      ...options
    };
  }

  /**
   * Generate HTML for the demo embed section
   */
  generateHTML() {
    const [width, height] = this.options.aspectRatio.split(':').map(Number);
    const paddingBottom = (height / width) * 100;

    return `
      <section class="demo-embed-section ${this.options.backgroundColor} py-16">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-12">
              <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                ${this.options.title}
              </h2>
              <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                ${this.options.description}
              </p>
              
              ${this.options.technologies.length > 0 ? `
                <div class="mt-6 flex flex-wrap justify-center gap-2">
                  ${this.options.technologies.map(tech => `
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      ${tech}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Demo Container -->
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
              ${this.options.showControls ? `
                <div class="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">Interactive Demo</span>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      ${this.options.showFullscreen && this.options.fullscreenUrl ? `
                        <a href="${this.options.fullscreenUrl}" target="_blank" rel="noopener noreferrer" 
                           class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                           title="Open in Fullscreen">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                          </svg>
                        </a>
                      ` : ''}
                      
                      <button onclick="refreshDemo()" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                              title="Refresh Demo">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Demo Embed -->
              <div class="demo-embed-container" style="position: relative; padding-bottom: ${paddingBottom}%; height: 0; overflow: hidden;">
                ${this.options.embedUrl ? `
                  <iframe 
                    src="${this.options.embedUrl}" 
                    class="demo-iframe"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    allowfullscreen
                    loading="lazy"
                    title="${this.options.title}">
                  </iframe>
                ` : `
                  <div class="demo-placeholder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div class="text-center">
                      ${this.options.thumbnail ? `
                        <img src="${this.options.thumbnail}" alt="${this.options.title}" class="w-32 h-32 mx-auto mb-4 rounded-lg object-cover">
                      ` : `
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      `}
                      <h3 class="text-xl font-semibold mb-2">Demo Coming Soon</h3>
                      <p class="opacity-75">Interactive demo will be available here</p>
                    </div>
                  </div>
                `}
              </div>
            </div>

            <!-- Demo Info -->
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Interactive</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Fully functional demo</p>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Real-time</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Live demonstration</p>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Innovative</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Cutting-edge technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generate CSS for the demo embed section
   */
  generateCSS() {
    return `
      .demo-embed-container {
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .demo-iframe {
        background: white;
      }
      
      .demo-placeholder {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .demo-embed-section .btn {
        transition: all 0.3s ease;
      }
      
      .demo-embed-section .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }
      
      @media (max-width: 768px) {
        .demo-embed-section {
          padding: 3rem 0;
        }
      }
    `;
  }

  /**
   * Generate JavaScript for the demo embed section
   */
  generateJS() {
    return `
      // Demo embed functionality
      function refreshDemo() {
        const iframe = document.querySelector('.demo-iframe');
        if (iframe) {
          const src = iframe.src;
          iframe.src = src;
        }
      }
      
      document.addEventListener('DOMContentLoaded', function() {
        // Handle iframe loading
        const iframe = document.querySelector('.demo-iframe');
        if (iframe) {
          iframe.addEventListener('load', function() {
            console.log('Demo loaded successfully');
          });
          
          iframe.addEventListener('error', function() {
            console.error('Error loading demo');
          });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
          // F11 for fullscreen (if supported)
          if (e.key === 'F11' && document.querySelector('.demo-iframe')) {
            e.preventDefault();
            const fullscreenUrl = document.querySelector('[title="Open in Fullscreen"]');
            if (fullscreenUrl) {
              window.open(fullscreenUrl.href, '_blank');
            }
          }
          
          // F5 or Ctrl+R to refresh demo
          if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && document.querySelector('.demo-iframe')) {
            e.preventDefault();
            refreshDemo();
          }
        });
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

module.exports = DemoEmbedSection;