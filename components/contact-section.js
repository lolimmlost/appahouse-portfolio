class ContactSection {
  constructor() {
    this.contactSection = null;
    this.config = window.CONTACT_CONFIG || {};
    this.init();
  }

  init() {
    this.createContactSection();
  }

  createContactSection() {
    // Get the existing contact section
    this.contactSection = document.getElementById('contact');
    if (!this.contactSection) return;

    // Clear existing content except the container
    const container = this.contactSection.querySelector('.container');
    if (!container) return;

    // Update the contact section with enhanced content
    container.innerHTML = `
      <div class="max-w-6xl mx-auto">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Let's Connect
          </h2>
          <p class="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Information -->
          <div class="lg:col-span-1">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <a href="mailto:${this.config.contact?.email || 'contact@appahouse.dev'}" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      ${this.config.contact?.email || 'contact@appahouse.dev'}
                    </a>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${this.config.contact?.location || 'San Francisco, CA'}</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Availability</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${this.config.contact?.availability || 'Open to opportunities'}</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Preferred Contact</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${this.config.contact?.preferredContact || 'Email or LinkedIn'}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Connect on Social Media</h4>
                <div class="flex space-x-3">
                  <a href="${this.config.social?.github || 'https://github.com/yourusername'}" target="_blank" rel="noopener noreferrer" class="social-icon github">
                    <span class="sr-only">GitHub</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a href="${this.config.social?.linkedin || 'https://linkedin.com/in/yourusername'}" target="_blank" rel="noopener noreferrer" class="social-icon linkedin">
                    <span class="sr-only">LinkedIn</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a href="${this.config.resume?.url || '#'}" class="btn btn-secondary w-full flex items-center justify-center" download="${this.config.resume?.filename || 'resume.pdf'}">
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send Me a Message</h3>
              
              <form id="contact-form" action="${this.config.formspree?.endpoint || 'https://formspree.io/f/YOUR_FORMSPREE_ID'}" method="POST" class="space-y-6">
                <!-- Honeypot field for spam protection -->
                <div style="display: none;">
                  <label for="honeypot">Don't fill this out if you're human:</label>
                  <input type="text" name="honeypot" id="honeypot" tabindex="-1" autocomplete="off">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                    <input type="text" name="name" id="name" required 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                           placeholder="John Doe">
                  </div>
                  
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                    <input type="email" name="email" id="email" required 
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                           placeholder="john@example.com">
                  </div>
                </div>
                
                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject *</label>
                  <input type="text" name="subject" id="subject" required 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                         placeholder="Project inquiry">
                </div>
                
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                  <textarea id="message" name="message" rows="5" required 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Tell me about your project..."></textarea>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="privacy" name="privacy" required 
                         class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                  <label for="privacy" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <a href="#" class="text-primary-600 hover:text-primary-500">privacy policy</a> *
                  </label>
                </div>
                
                <div>
                  <button type="submit" id="submit-btn" 
                          class="btn btn-primary w-full flex items-center justify-center">
                    <span id="submit-text">Send Message</span>
                    <svg id="submit-spinner" class="hidden animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </div>
              </form>
              
              <div id="form-message" class="mt-4 hidden"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add styles for social icons
    this.addSocialIconStyles();
  }

  addSocialIconStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .social-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 0.3s ease;
        color: #6b7280;
      }
      
      .social-icon:hover {
        transform: translateY(-3px);
      }
      
      .social-icon.github:hover {
        background-color: #333;
        color: white;
      }
      
      .social-icon.linkedin:hover {
        background-color: #0077b5;
        color: white;
      }
      
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .contact-section {
        animation: fadeIn 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize the contact section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactSection();
});