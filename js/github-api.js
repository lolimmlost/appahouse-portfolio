document.addEventListener('DOMContentLoaded', function() {
const githubActivityContainer = document.getElementById('github-activity');

if (!githubActivityContainer) return;

// Get GitHub configuration
const githubUsername = window.GITHUB_CONFIG ? window.GITHUB_CONFIG.username : 'YOUR_GITHUB_USERNAME';
const userApiUrl = window.GITHUB_CONFIG ? window.GITHUB_CONFIG.userApiUrl : `https://api.github.com/users/${githubUsername}`;
const eventsApiUrl = window.GITHUB_CONFIG ? window.GITHUB_CONFIG.eventsApiUrl : `https://api.github.com/users/${githubUsername}/events/public`;
const reposApiUrl = window.GITHUB_CONFIG ? window.GITHUB_CONFIG.reposApiUrl : `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`;

// Cache configuration
const cacheConfig = window.GITHUB_CONFIG ? window.GITHUB_CONFIG.cache : { duration: 30 * 60 * 1000, keyPrefix: `github-${githubUsername}` };
const CACHE_KEY_PREFIX = cacheConfig.keyPrefix;
const USER_CACHE_KEY = `${CACHE_KEY_PREFIX}-user`;
const EVENTS_CACHE_KEY = `${CACHE_KEY_PREFIX}-events`;
const REPOS_CACHE_KEY = `${CACHE_KEY_PREFIX}-repos`;
const CACHE_DURATION = cacheConfig.duration;

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

// Function to create contribution graph using GitHub's embedded calendar
function createContributionGraph(events) {
  const isDarkMode = document.documentElement.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Check if mobile (less than 640px)
  const isMobile = window.innerWidth < 640;

  // Generate HTML with link to full contribution graph on GitHub
  let html = '<div class="mt-6">';
  html += '<div class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide">Contribution Graph</div>';

  // Use ghchart.rshah.org for the contribution graph image
  const chartUrl = `https://ghchart.rshah.org/${githubUsername}`;

  if (isMobile) {
    // Mobile: Show only last ~4 months by using a scrolled container
    html += `
      <div class="w-full border-3 border-black dark:border-gray-600 bg-white dark:bg-gray-800 p-2 overflow-hidden max-w-full">
        <div style="width: 100%; overflow: hidden;">
          <div id="contrib-graph-container" style="width: 720px; margin-left: -480px;">
            <img
              src="${chartUrl}"
              alt="GitHub Contribution Graph for ${githubUsername}"
              style="width: 720px; height: auto; display: block; filter: ${isDarkMode ? 'brightness(0.8) contrast(1.2)' : 'none'};"
              onerror="this.parentElement.parentElement.innerHTML='<p style=\\'text-align:center;padding:1rem;color:#888;\\'>Unable to load graph</p>'"
            />
          </div>
        </div>
      </div>
    `;
  } else {
    // Desktop: Show full graph with scroll
    html += `
      <div class="w-full border-3 border-black dark:border-gray-600 bg-white dark:bg-gray-800 p-4 overflow-x-auto max-w-full">
        <img
          src="${chartUrl}"
          alt="GitHub Contribution Graph for ${githubUsername}"
          class="h-auto min-w-[700px] w-full"
          style="filter: ${isDarkMode ? 'brightness(0.8) contrast(1.2)' : 'none'};"
          onerror="this.parentElement.innerHTML='<p class=\\'text-center text-gray-500 dark:text-gray-400 py-4\\'>Unable to load contribution graph. <a href=\\'https://github.com/${githubUsername}\\' class=\\'underline\\'>View on GitHub</a></p>'"
        />
      </div>
    `;
  }

  html += `
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center font-medium">
      <a href="https://github.com/${githubUsername}" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary-500">
        View full contribution history on GitHub
      </a>
    </p>
  `;

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

  return fetchGitHubUserUncached();
}

// Function to fetch GitHub user data without cache
async function fetchGitHubUserUncached() {
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

  return fetchGitHubReposUncached();
}

// Function to fetch GitHub repositories without cache
async function fetchGitHubReposUncached() {
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
async function fetchGitHubActivity(forceRefresh = false) {
  // Show loading state
  showLoading();

  try {
    // If forceRefresh is true, clear the cache
    if (forceRefresh) {
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem(REPOS_CACHE_KEY);
      localStorage.removeItem(EVENTS_CACHE_KEY);
    }

    // Check if we have cached data (only if not forcing refresh)
    const cachedEvents = forceRefresh ? null : getCachedData(EVENTS_CACHE_KEY);

    // Fetch user data and repositories in parallel
    const [userData, reposData] = await Promise.all([
      forceRefresh ? fetchGitHubUserUncached() : fetchGitHubUser(),
      forceRefresh ? fetchGitHubReposUncached() : fetchGitHubRepos()
    ]);
    
    // If we have cached events, use them
    let events = cachedEvents;
    
    // If no cached events or forcing refresh, fetch them
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
          <button onclick="fetchGitHubActivity(true)" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
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

  // Get top repositories sorted by recent update
  const sortedRepos = reposData
    .filter(repo => !repo.fork) // Exclude forks
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5); // Show top 5 recently updated repositories

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
  <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
    <img src="${userData.avatar_url}" alt="${userData.login}" class="w-20 h-20 sm:w-24 sm:h-24 border-4 border-black shadow-brutal-sm flex-shrink-0">
    <div class="text-center sm:text-left min-w-0 flex-1">
      <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight break-words">${userData.name || userData.login}</h3>
      <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 font-medium">${userData.bio || 'No bio available'}</p>
      <div class="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
        <div class="text-gray-700 dark:text-gray-300">
          <span class="text-base sm:text-lg text-gray-900 dark:text-white">${userData.public_repos}</span> REPOS
        </div>
        <div class="text-gray-700 dark:text-gray-300">
          <span class="text-base sm:text-lg text-gray-900 dark:text-white">${userData.followers}</span> FOLLOWERS
        </div>
        <div class="text-gray-700 dark:text-gray-300">
          <span class="text-base sm:text-lg text-gray-900 dark:text-white">${userData.following}</span> FOLLOWING
        </div>
      </div>
    </div>
  </div>
`;

// Add contribution graph
html += createContributionGraph(events);

// Add tabs for different sections
html += `
  <div class="mt-8">
    <div class="border-b-4 border-black dark:border-gray-600">
      <nav class="-mb-1 flex" aria-label="Tabs">
        <button onclick="showTab('repositories')" id="repositories-tab" class="tab-button active border-b-4 border-primary-500 bg-primary-400 text-black flex-1 py-2 sm:py-3 px-1 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide text-center">
          Repos
        </button>
        <button onclick="showTab('activity')" id="activity-tab" class="tab-button border-b-4 border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex-1 py-2 sm:py-3 px-1 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide text-center">
          Activity
        </button>
        <button onclick="showTab('languages')" id="languages-tab" class="tab-button border-b-4 border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex-1 py-2 sm:py-3 px-1 sm:px-6 font-bold text-xs sm:text-sm uppercase tracking-wide text-center">
          Langs
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
  sortedRepos.forEach(repo => {
    const lastUpdated = formatRelativeTime(repo.pushed_at);

    html += `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="block border-3 border-black dark:border-gray-600 p-3 sm:p-5 shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-white dark:bg-gray-800">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
            <h4 class="font-black text-base sm:text-lg text-gray-900 dark:text-white uppercase break-words min-w-0">${repo.name}</h4>
            <div class="text-left sm:text-right flex-shrink-0">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Updated </span>
              <span class="text-xs font-black text-gray-900 dark:text-white">${lastUpdated}</span>
            </div>
          </div>
          ${repo.description ? `<p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-2">${repo.description}</p>` : ''}
          <div class="flex flex-wrap items-center gap-3 sm:gap-4">
            ${repo.language ? `
              <div class="flex items-center">
                <span class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black mr-1.5 sm:mr-2 flex-shrink-0" style="background-color: ${getLanguageColor(repo.language)}"></span>
                <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">${repo.language}</span>
              </div>
            ` : ''}
            <div class="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              ${repo.stargazers_count}
            </div>
            <div class="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              ${repo.forks_count}
            </div>
          </div>
        </div>
      </a>
    `;
  });
} else {
  html += `
    <div class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400">No repositories found</p>
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
        const commitCount = event.payload.commits ? event.payload.commits.length : event.payload.size || 1;
        eventHtml = `
          <div class="flex items-start border-3 border-black dark:border-gray-600 p-4 bg-green-50 dark:bg-green-900/20 shadow-brutal-sm">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-primary-400 border-3 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="square" stroke-linejoin="miter" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                PUSHED TO
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-primary-600 dark:hover:text-primary-400">
                  ${repoName}
                </a>
              </p>
              <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 uppercase">${formatRelativeTime(event.created_at)}</p>
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
          <div class="flex items-start border-3 border-black dark:border-gray-600 p-4 bg-accent-50 dark:bg-accent-900/20 shadow-brutal-sm">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-accent-400 border-3 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="square" stroke-linejoin="miter" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                ${issueAction.toUpperCase()} ISSUE
                <a href="${event.payload.issue.html_url}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-accent-600 dark:hover:text-accent-400">
                  #${issueNumber} ${issueTitle}
                </a> IN
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-accent-600 dark:hover:text-accent-400">
                  ${issueRepo}
                </a>
              </p>
              <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 uppercase">${formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        `;
        break;
        
      case 'PullRequestEvent':
        const prRepo = event.repo.name.split('/')[1];
        const prAction = event.payload.action === 'opened' ? 'opened' : event.payload.action === 'closed' ? 'closed' : 'updated';
        const prTitle = event.payload.pull_request?.title || 'Pull Request';
        const prNumber = event.payload.pull_request?.number || event.payload.number || '';
        const prUrl = event.payload.pull_request?.html_url || `https://github.com/${event.repo.name}/pull/${prNumber}`;
        eventHtml = `
          <div class="flex items-start border-3 border-black dark:border-gray-600 p-4 bg-purple-50 dark:bg-purple-900/20 shadow-brutal-sm">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-400 border-3 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="square" stroke-linejoin="miter" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                ${prAction.toUpperCase()} PULL REQUEST
                <a href="${prUrl}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-purple-600 dark:hover:text-purple-400">
                  ${prNumber ? '#' + prNumber : ''} ${prTitle}
                </a> IN
                <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-purple-600 dark:hover:text-purple-400">
                  ${prRepo}
                </a>
              </p>
              <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 uppercase">${formatRelativeTime(event.created_at)}</p>
            </div>
          </div>
        `;
        break;
        
      case 'CreateEvent':
        if (event.payload.ref_type === 'repository') {
          const createdRepo = event.repo.name.split('/')[1];
          eventHtml = `
            <div class="flex items-start border-3 border-black dark:border-gray-600 p-4 bg-blue-50 dark:bg-blue-900/20 shadow-brutal-sm">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-400 border-3 border-black flex items-center justify-center">
                  <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                    <path stroke-linecap="square" stroke-linejoin="miter" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  CREATED REPOSITORY
                  <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-blue-600 dark:hover:text-blue-400">
                    ${createdRepo}
                  </a>
                </p>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 uppercase">${formatRelativeTime(event.created_at)}</p>
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
    <a href="https://github.com/${githubUsername}?tab=contributions" target="_blank" rel="noopener noreferrer"
       class="inline-flex items-center ml-4 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
      <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
      </svg>
      Full Contribution Graph
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
    <button onclick="fetchGitHubActivity(true)" class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:text-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800">
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
    button.classList.remove('active', 'border-primary-500', 'bg-primary-400', 'text-black');
    button.classList.add('border-transparent', 'text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
  });

  // Show the selected tab content
  document.getElementById(`${tabName}-content`).classList.remove('hidden');

  // Add active class to the selected tab button
  const activeTab = document.getElementById(`${tabName}-tab`);
  activeTab.classList.add('active', 'border-primary-500', 'bg-primary-400', 'text-black');
  activeTab.classList.remove('border-transparent', 'text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
};

// Fetch GitHub activity when the page loads
fetchGitHubActivity();

// Make fetchGitHubActivity globally accessible for the refresh button
window.fetchGitHubActivity = fetchGitHubActivity;
});