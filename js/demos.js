// Demos functionality for the main portfolio page
document.addEventListener('DOMContentLoaded', function() {
  loadDemos();
});

async function loadDemos() {
  const container = document.getElementById('demos-container');
  
  try {
    // Load demos configuration
    const response = await fetch('demos.json');
    const demosConfig = await response.json();
    
    if (!demosConfig.sections || demosConfig.sections.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No demos available yet. Check back soon!</p>
        </div>
      `;
      return;
    }
    
    // Clear loading state
    container.innerHTML = '';
    
    // Render each demo section
    demosConfig.sections.forEach(section => {
      const demoCard = createDemoCard(section);
      container.appendChild(demoCard);
    });
    
  } catch (error) {
    console.error('Error loading demos:', error);
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500 dark:text-red-400">Error loading demos. Please try again later.</p>
      </div>
    `;
  }
}

function createDemoCard(section) {
  const card = document.createElement('div');
  card.className = 'card p-6 hover:shadow-lg transition-shadow duration-300';
  
  card.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">${section.title}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">${section.description}</p>
        
        ${section.technologies ? `
          <div class="flex flex-wrap gap-2 mb-4">
            ${section.technologies.map(tech => `
              <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded">
                ${tech}
              </span>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div class="mt-4">
        ${section.demoUrl ? `
          <a href="${section.demoUrl}" target="_blank" rel="noopener noreferrer" 
             class="btn btn-primary w-full mb-2">
            View Live Demo
          </a>
        ` : ''}
        
        ${section.githubUrl ? `
          <a href="${section.githubUrl}" target="_blank" rel="noopener noreferrer" 
             class="btn btn-secondary w-full">
            View Source Code
          </a>
        ` : ''}
      </div>
    </div>
  `;
  
  return card;
}