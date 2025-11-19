// GitHub Configuration
// This file contains the GitHub API configuration for the portfolio

window.GITHUB_CONFIG = {
  username: 'lolimmlost',
  userApiUrl: 'https://api.github.com/users/lolimmlost',
  eventsApiUrl: 'https://api.github.com/users/lolimmlost/events/public',
  reposApiUrl: 'https://api.github.com/users/lolimmlost/repos?per_page=100&sort=updated',
  cache: {
    duration: 30 * 60 * 1000, // 30 minutes
    keyPrefix: 'github-lolimmlost'
  }
};
