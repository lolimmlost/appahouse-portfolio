document.addEventListener('DOMContentLoaded', function() {
const githubActivityContainer = document.getElementById('github-activity');

if (!githubActivityContainer) return;

// Replace with your GitHub username
const githubUsername = 'Lolimmlost';

// GitHub API URLs
const userApiUrl = `https://api.github.com/users/${githubUsername}`;
const eventsApiUrl = `https://api.github.com/users/${githubUsername}/events/public`;
const reposApiUrl = `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`;

// Cache configuration
const CACHE_KEY_PREFIX = `github-${githubUsername}`;
const USER_CACHE_KEY = `${CACHE_KEY_PREFIX}-user`;
const EVENTS_CACHE_KEY = `${CACHE_KEY_PREFIX}-events`;
const REPOS_CACHE_KEY = `${CACHE_KEY_PREFIX}-repos`;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to get cached data
function getCachedData(cacheKey) {
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) return null;

    const { data, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  } catch (error) {
    console.error('Error reading cached data:', error);
  }
  return null;
}

// Function to cache data
function cacheData(cacheKey, data) {
  try {
    const cacheItem = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

// Function to show loading state
function showLoading() {
githubActivityContainer.innerHTML = `<div class="flex justify-center items-center py-8"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div> </div>`;
}

// Function to format date
function formatDate(dateString) {
const date = new Date(dateString);
return date.toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
hour: '2-digit',
minute: '2-digit'
});
}

// Function to format relative time
function formatRelativeTime(dateString) {
const date = new Date(dateString);
const now = new Date();
const diffMs = now - date;
const diffMins = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMins / 60);
const diffDays = Math.floor(diffHours / 24);

if (diffMins < 1) return 'just now';
if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

return date.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric'
});

}

// Function to get language color
function getLanguageColor(language) {
const colors = {
'JavaScript': '#f1e05a',
'TypeScript': '#3178c6',
'HTML': '#e34c26',
'CSS': '#563d7c',
'Python': '#3572A5',
'Java': '#b07219',
'C#': '#239120',
'PHP': '#4F5D95',
'C++': '#f34b7d',
'Go': '#00ADD8',
'Rust': '#dea584',
'Ruby': '#701516',
'Swift': '#ffac45',
'Kotlin': '#F18E33',
'Scala': '#c22d40',
'Shell': '#89e051',
'Vue': '#2c3e50',
'React': '#61dafb',
'Angular': '#dd0031',
'Svelte': '#ff3e00',
'Dockerfile': '#384d54',
};
return colors[language] || '#586069';
}

// Function to create contribution graph
function createContributionGraph(events) {
// Get the last 52 weeks (1 year)
const weeks = 52;
const daysInWeek = 7;
const graph = [];

// Initialize graph with zeros
for (let i = 0; i < weeks; i++) {
  const week = [];
  for (let j = 0; j < daysInWeek; j++) {
    week.push(0);
  }
  graph.push(week);
}

// Count contributions for each day
events.forEach(event => {
  if (event.type === 'PushEvent' || event.type === 'IssuesEvent' || 
      event.type === 'PullRequestEvent' || event.type === 'CreateEvent') {
    const eventDate = new Date(event.created_at);
    const daysAgo = Math.floor((new Date() - eventDate) / (1000 * 60 * 60 * 24));
    
    if (daysAgo < weeks * daysInWeek) {
      const weekIndex = Math.floor(daysAgo / daysInWeek);
      const dayIndex = daysInWeek - 1 - (daysAgo % daysInWeek);
      
      if (weekIndex < weeks && dayIndex >= 0 && dayIndex < daysInWeek) {
        graph[weekIndex][dayIndex]++;
      }
    }
  }
});

// Find max contributions for scaling
let maxContributions = 1;
graph.forEach(week => {
  week.forEach(day => {
    if (day > maxContributions) maxContributions = day;
  });
});

// Generate HTML for the graph
let html = '<div class="mt-4">';
html += '<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Contributions in the last year</div>';
html += '<div class="flex flex-wrap gap-1">';

// Month labels
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonth = new Date().getMonth();
html += '<div class="w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">';
for (let i = 0; i < 12; i++) {
  const monthIndex = (currentMonth - i + 12) % 12;
  html += `<span class="w-8 text-right">${months[monthIndex]}</span>`;
}
html += '</div>';

// Contribution squares
html += '<div class="flex flex-wrap gap-1">';
for (let week = 0; week < weeks; week++) {
  for (let day = 0; day < daysInWeek; day++) {
    const contributions = graph[weeks - 1 - week][day];
    let level = 0;
    
    if (contributions > 0) {
      level = Math.min(4, Math.ceil((contributions / maxContributions) * 4));
    }
    
    const colors = [
      'bg-gray-100 dark:bg-gray-800',
      'bg-green-100 dark:bg-green-900',
      'bg-green-300 dark:bg-green-700',
      'bg-green-500 dark:bg-green-500',
      'bg-green-700 dark:bg-green-300'
    ];
    
    html += `<div class="w-3 h-3 rounded-sm ${colors[level]}" title="${contributions} contributions"></div>`;
  }
}
html += '</div>';

// Legend
html += '<div class="flex items-center justify-end mt-2 text-xs text-gray-500 dark:text-gray-400">';
html += '<span class="mr-2">Less</span>';
html += '<div class="flex gap-1">';
for (let i = 0; i < 5; i++) {
  const colors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-green-100 dark:bg-green-900',
    'bg-green-300 dark:bg-green-700',
    'bg-green-500 dark:bg-green-500',
    'bg-green-700 dark:bg-green-300'
  ];
  html += `<div class="w-3 h-3 rounded-sm ${colors[i]}"></div>`;
}
html += '</div>';
html += '<span class="ml-2">More</span>';
html += '</div>';

html += '</div>';
return html;


}

// Function to fetch GitHub user data
async function fetchGitHubUser() {
  // Check if we have cached data
  const cachedData = getCachedData(USER_CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(userApiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }
    
    const userData = await response.json();
    
    // Cache the data
    cacheData(USER_CACHE_KEY, userData);
    
    return userData;
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    throw error;
  }
}

// Function to fetch GitHub repositories
async function fetchGitHubRepos() {
  // Check if we have cached data
  const cachedData = getCachedData(REPOS_CACHE_KEY);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(reposApiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned status: ${response.status}`);
    }
    
    const reposData = await response.json();
    
    // Cache the data
    cacheData(REPOS_CACHE_KEY, reposData);
    
    return reposData;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
}

// Function to fetch GitHub activity
async function fetchGitHubActivity() {
  // Show loading state
  showLoading();

  // Check if we have cached data
  const cachedEvents = getCachedData(EVENTS_CACHE_KEY);

  try {
    // Fetch user data and repositories in parallel
    const [userData, reposData] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepos()
    ]);
    
    // If we have cached events, use them
    let events = cachedEvents;
    
    // If no cached events, fetch them
    if (!events) {
      const response = await fetch(eventsApiUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          // Rate limit exceeded
          const rateLimitReset = new Date(response.headers.get('X-RateLimit-Reset') * 1000);
          throw new Error(`Rate limit exceeded. Try again after ${rateLimitReset.toLocaleTimeString()}.`);
        } else if (response.status === 404) {
          throw new Error(`User '${githubUsername}' not found.`);
        } else {
          throw new Error(`GitHub API returned status: ${response.status}`);
        }
      }
      
      events = await response.json();
      
      // Cache the events
      cacheData(EVENTS_CACHE_KEY, events);
    }
    
    // Display the activity
    displayGitHubActivity(userData, reposData, events, !!cachedEvents);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    
    // Check if we have stale cached data to show as fallback
    const staleUser = getCachedData(USER_CACHE_KEY);
    const staleRepos = getCachedData(REPOS_CACHE_KEY);
    const staleEvents = getCachedData(EVENTS_CACHE_KEY);
    
    if (staleUser && staleRepos && staleEvents) {
      displayGitHubActivity(staleUser, staleRepos, staleEvents, true, true);
      return;
    }
    
    // Show error message
    githubActivityContainer.innerHTML = `
      <div class="text-center py-6">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Unable to load GitHub activity</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${error.message}</p>
        <div class="mt-6">
          <button onclick="fetchGitHubActivity()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Try Again
          </button>
        </div>
      </div>
    `;
  }
}

// Function to display GitHub activity
function displayGitHubActivity(userData, reposData, events, isCached = false, isStale = false) {
  // Filter for different event types
  const pushEvents = events.filter(event => event.type === 'PushEvent');
  const issueEvents = events.filter(event => event.type === 'IssuesEvent');
  const prEvents = events.filter(event => event.type === 'PullRequestEvent');
  const createEvents = events.filter(event => event.type === 'CreateEvent' && event.payload.ref_type === 'repository');

  // Create a map of repositories and their commit counts
  const repoCommitMap = {};

  pushEvents.forEach(event => {
    const repoName = event.repo.name.split('/')[1];
    const commitCount = event.payload.commits ? event.payload.commits.length : 0;
    
    if (repoCommitMap[repoName]) {
      repoCommitMap[repoName] += commitCount;
    } else {
      repoCommitMap[repoName] = commitCount;
    }
  });

  // Sort repositories by commit count (descending)
  const sortedRepos = Object.entries(repoCommitMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Show top 5 repositories

  // Calculate language statistics
  const languageStats = {};
  reposData.forEach(repo => {
    if (repo.language) {
      if (languageStats[repo.language]) {
        languageStats[repo.language]++;
      } else {
        languageStats[repo.language] = 1;
      }
    }
  });

  // Sort languages by usage
  const sortedLanguages = Object.entries(languageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6); // Show top 6 languages

  // Get the timestamp for the most recent event
  const lastUpdated = events.length > 0 ? new Date(events[0].created_at).getTime() : new Date().getTime();

// Create HTML for the user profile section
let html = `
  <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
    <img src="${userData.avatar_url}" alt="${userData.login}" class="w-20 h-20 rounded-full">
    <div class="text-center sm:text-left">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">${userData.name || userData.login}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-2">${userData.bio || 'No bio available'}</p>
      <div class="flex justify-center sm:justify-start gap-4 text-sm">
        <div class="text-gray-600 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white">${userData.public_repos}</span> repos
        </div>
        <div class="text-gray-600 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white">${userData.followers}</span> followers
        </div>
        <div class="text-gray-600 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white">${userData.following}</span> following
        </div>
      </div>
    </div>
  </div>
`;

// Add contribution graph
html += createContributionGraph(events);

// Add tabs for different sections
html += `
  <div class="mt-6">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button onclick="showTab('repositories')" id="repositories-tab" class="tab-button active border-primary-500 text-primary-600 dark:text-primary-400 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
          Repositories
        </button>
        <button onclick="showTab('activity')" id="activity-tab" class="tab-button border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
          Activity
        </button>
        <button onclick="showTab('languages')" id="languages-tab" class="tab-button border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
          Languages
        </button>
      </nav>
    </div>
    
    <div class="mt-4">
      <!-- Repositories Tab -->
      <div id="repositories-content" class="tab-content">
        <div class="space-y-4">
`;

// Add top repositories
if (sortedRepos.length > 0) {
  sortedRepos.forEach(([repo, commitCount]) => {
    // Calculate percentage for the progress bar
    const maxCommits = Math.max(...sortedRepos.map(([_, count]) => count));
    const percentage = Math.round((commitCount / maxCommits) * 100);
    
    // Find repository details
    const repoDetails = reposData.find(r => r.name === repo);
    
    html += `
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white">${repo}</h4>
            ${repoDetails && repoDetails.description ? `<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${repoDetails.description}</p>` : ''}
            <div class="flex items-center gap-3 mt-2">
              ${repoDetails && repoDetails.language ? `
                <div class="flex items-center">
                  <span class="w-3 h-3 rounded-full mr-1" style="background-color: ${getLanguageColor(repoDetails.language)}"></span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">${repoDetails.language}</span>
                </div>
              ` : ''}
              ${repoDetails && repoDetails.stargazers_count > 0 ? `
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ${repoDetails.stargazers_count}
                </div>
              ` : ''}
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">${commitCount} commits</div>
            <div class="w-24 bg-gray-200 rounded-full h-2 mt-1 dark:bg-gray-700">
              <div class="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out" style="width: ${percentage}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
} else {
  html += `
    <div class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No recent repository activity</p>
    </div>
  `;
}

html += `
        </div>
      </div>
      
      <!-- Activity Tab -->
      <div id="activity-content" class="tab-content hidden">
        <div class="space-y-4">
`;

// Add recent activity
const recentEvents = events.slice(0, 10); // Show last 10 events

if (recentEvents.length > 0) {
  recentEvents.forEach(event => {
    const eventDate = new Date(event.created_at);
    let eventHtml = '';
    
    switch (event.type) {
      case 'PushEvent':
        const repoName = event.repo.name.split('/')[1];
        const commitCount = event.payload.commits ? event.payload.commits.length : 0;
        eventHtml = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900 dark:text-white">
                Pushed <span class="font-medium">${commitCount} commit${commitCount !== 1 ? 's' : ''}</span> to 
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  ${repoName}
                </a>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        `;
        break;
        
      case 'IssuesEvent':
        const issueRepo = event.repo.name.split('/')[1];
        const issueAction = event.payload.action === 'opened' ? 'opened' : event.payload.action === 'closed' ? 'closed' : 'updated';
        const issueTitle = event.payload.issue.title;
        const issueNumber = event.payload.issue.number;
        eventHtml = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900 dark:text-white">
                ${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} issue 
                <a href="${event.payload.issue.html_url}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  #${issueNumber} ${issueTitle}
                </a> in 
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  ${issueRepo}
                </a>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        `;
        break;
        
      case 'PullRequestEvent':
        const prRepo = event.repo.name.split('/')[1];
        const prAction = event.payload.action === 'opened' ? 'opened' : event.payload.action === 'closed' ? 'closed' : 'updated';
        const prTitle = event.payload.pull_request.title;
        const prNumber = event.payload.pull_request.number;
        eventHtml = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900 dark:text-white">
                ${prAction.charAt(0).toUpperCase() + prAction.slice(1)} pull request 
                <a href="${event.payload.pull_request.html_url}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  #${prNumber} ${prTitle}
                </a> in 
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  ${prRepo}
                </a>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        `;
        break;
        
      case 'CreateEvent':
        if (event.payload.ref_type === 'repository') {
          const createdRepo = event.repo.name.split('/')[1];
          eventHtml = `
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-900 dark:text-white">
                  Created repository 
                  <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    ${createdRepo}
                  </a>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatRelativeTime(event.created_at)}</p>
              </div>
            </div>
          `;
        }
        break;
    }
    
    if (eventHtml) {
      html += eventHtml;
    }
  });
} else {
  html += `
    <div class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
    </div>
  `;
}

html += `
        </div>
      </div>
      
      <!-- Languages Tab -->
      <div id="languages-content" class="tab-content hidden">
        <div class="space-y-4">
`;

// Add language statistics
if (sortedLanguages.length > 0) {
  const totalRepos = sortedLanguages.reduce((sum, [_, count]) => sum + count, 0);
  
  sortedLanguages.forEach(([language, count]) => {
    const percentage = Math.round((count / totalRepos) * 100);
    
    html += `
      <div>
        <div class="flex justify-between mb-1">
          <div class="flex items-center">
            <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${getLanguageColor(language)}"></span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${language}</span>
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${count} repo${count !== 1 ? 's' : ''} (${percentage}%)</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="h-2.5 rounded-full transition-all duration-500 ease-out" style="width: ${percentage}%; background-color: ${getLanguageColor(language)}"></div>
        </div>
      </div>
    `;
  });
} else {
  html += `
    <div class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No language data available</p>
    </div>
  `;
}

html += `
        </div>
      </div>
    </div>
  </div>
`;

// Add a link to the GitHub profile
html += `
  <div class="mt-6 text-center">
    <a href="https://github.com/${githubUsername}" target="_blank" rel="noopener noreferrer" 
       class="inline-flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
      <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
      </svg>
      View GitHub Profile
    </a>
  </div>
`;

// Add last updated timestamp and cache status
const cacheStatus = isCached ? (isStale ? ' (stale)' : ' (cached)') : '';
html += `
  <div class="mt-4 text-center">
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Last updated: ${formatRelativeTime(new Date(lastUpdated).toISOString())}${cacheStatus}
    </p>
  </div>
`;

// Add refresh button
html += `
  <div class="mt-4 text-center">
    <button onclick="fetchGitHubActivity()" class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:text-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh
    </button>
  </div>
`;

githubActivityContainer.innerHTML = html;


}

// Function to show a specific tab
window.showTab = function(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.add('hidden');
  });

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.classList.remove('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
    button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300', 'dark:hover:border-gray-600');
  });

  // Show the selected tab content
  document.getElementById(`${tabName}-content`).classList.remove('hidden');

  // Add active class to the selected tab button
  const activeTab = document.getElementById(`${tabName}-tab`);
  activeTab.classList.add('active', 'border-primary-500', 'text-primary-600', 'dark:text-primary-400');
  activeTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300', 'dark:hover:border-gray-600');
};

// Fetch GitHub activity when the page loads
fetchGitHubActivity();

// Make fetchGitHubActivity globally accessible for the refresh button
window.fetchGitHubActivity = fetchGitHubActivity;
});