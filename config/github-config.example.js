// GitHub API configuration
// Copy this file to github-config.js and fill in your actual values
const GITHUB_CONFIG = {
  // Replace with your GitHub username
  username: 'YOUR_GITHUB_USERNAME',
  
  // GitHub API endpoints (will be constructed with username)
  get userApiUrl() {
    return `https://api.github.com/users/${this.username}`;
  },
  
  get eventsApiUrl() {
    return `https://api.github.com/users/${this.username}/events/public`;
  },
  
  get reposApiUrl() {
    return `https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`;
  },
  
  // Cache configuration
  cache: {
    // Cache duration in milliseconds (30 minutes)
    duration: 30 * 60 * 1000,
    
    // Get cache key prefix based on username
    get keyPrefix() {
      return `github-${this.username}`;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GITHUB_CONFIG;
} else {
  window.GITHUB_CONFIG = GITHUB_CONFIG;
}