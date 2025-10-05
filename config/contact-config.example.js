// Contact form configuration
// Copy this file to contact-config.js and fill in your actual values
const CONTACT_CONFIG = {
  // Formspree configuration
  formspree: {
    // Replace YOUR_FORMSPREE_ID with your actual Formspree form ID
    // To get your Formspree ID:
    // 1. Sign up at https://formspree.io
    // 2. Create a new form
    // 3. Copy the form ID from the form's integration page
    // 4. Replace YOUR_FORMSPREE_ID below with your actual ID
    formId: 'YOUR_FORMSPREE_ID',
    
    // Formspree endpoint URL (will be constructed with formId)
    get endpoint() {
      return `https://formspree.io/f/${this.formId}`;
    }
  },
  
  // Contact information
  contact: {
    email: 'your-email@example.com',
    location: 'Your City, State',
    availability: 'Open to opportunities',
    preferredContact: 'Email or LinkedIn'
  },
  
  // Social media links
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile',
  },
  
  // Resume download link
  resume: {
    url: '#', // Replace with actual resume URL
    filename: 'resume.pdf'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONTACT_CONFIG;
} else {
  window.CONTACT_CONFIG = CONTACT_CONFIG;
}