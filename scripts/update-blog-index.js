#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Update the blog index with all markdown files in the blog directory
function updateBlogIndex() {
  const blogDir = 'blog';
  const indexPath = path.join(blogDir, 'index.json');
  
  try {
    // Read all files in the blog directory
    const files = fs.readdirSync(blogDir);
    
    // Filter for markdown files (excluding index.json)
    const markdownFiles = files
      .filter(file => file.endsWith('.md') && file !== 'index.json')
      .sort();
    
    // Write the index file
    fs.writeFileSync(indexPath, JSON.stringify(markdownFiles, null, 2));
    
    console.log(`✅ Blog index updated with ${markdownFiles.length} posts`);
    markdownFiles.forEach(file => console.log(`  - ${file}`));
    
    return markdownFiles;
  } catch (error) {
    console.error('❌ Error updating blog index:', error.message);
    process.exit(1);
  }
}

// Run the function
if (require.main === module) {
  updateBlogIndex();
}

module.exports = updateBlogIndex;