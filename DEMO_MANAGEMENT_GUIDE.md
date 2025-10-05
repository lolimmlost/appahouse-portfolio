# Demo Management Guide

This guide explains how to create, manage, and organize live demo sections for your portfolio website.

## Overview

The demo management system allows you to:
- Create and manage live demo sections with ease
- Build demo pages from reusable sections
- Validate demo data for consistency
- Generate standalone demo pages
- Organize demos by category and technology
- Handle CORS issues for local development

## Quick Start

### Creating Your First Demo Section

1. **Initialize the demo system** (if not already done):
   ```bash
   node scripts/demo-section-manager.js
   ```

2. **Add a new demo section**:
   ```bash
   npm run demo:new
   ```
   Follow the prompts to enter demo information:
   - Demo title
   - Description
   - Category
   - Technologies used
   - Embed URL (where your demo is hosted)
   - Fullscreen URL (optional)
   - Thumbnail image (optional)

3. **List existing demos**:
   ```bash
   npm run demo:list
   ```

4. **Update portfolio with demos**:
   ```bash
   npm run demo:update-portfolio
   ```

### Building Demo Pages

1. **Build a demo page with featured sections**:
   ```bash
   npm run demo:build
   ```

2. **Build all demo pages** (featured, by category, and all demos):
   ```bash
   npm run demo:build-all
   ```

3. **Generate a demo index page**:
   ```bash
   npm run demo:index
   ```

Generated demo pages will be saved in the `generated-demos/` directory.

## Demo Section Structure

### Demo Data Format

Each demo section is stored as JSON with the following structure:

```json
{
  "id": "demo-unique-id",
  "title": "Demo Title",
  "description": "Brief description of the demo",
  "category": "Web Development",
  "technologies": ["React", "Node.js", "Docker"],
  "embedUrl": "https://demo.example.com/embed",
  "fullscreenUrl": "https://demo.example.com",
  "thumbnail": "/assets/images/demo-thumb.jpg",
  "featured": true,
  "status": "active",
  "createdAt": "2023-12-01T10:00:00.000Z",
  "updatedAt": "2023-12-01T10:00:00.000Z"
}
```

### Field Descriptions

- **id**: Unique identifier for the demo (auto-generated from title)
- **title**: Display title of the demo
- **description**: Brief description of what the demo showcases
- **category**: Category for organizing demos (e.g., "E-commerce", "Productivity")
- **technologies**: Array of technologies used in the demo
- **embedUrl**: URL for embedding the demo in an iframe
  - For local development: `http://localhost:3001/`
  - For production: `https://demo.yourdomain.com/`
- **fullscreenUrl**: URL for opening the demo in fullscreen
- **thumbnail**: Path to thumbnail image
- **featured**: Whether to feature this demo on the main page
- **status**: Demo status ("active", "inactive", "archived")
- **createdAt**: Creation timestamp (auto-generated)
- **updatedAt**: Last update timestamp (auto-generated)

## Working with Demo Sections

### Manual Demo Management

You can manually edit demo sections by:

1. **Editing the main index** (`demos.json`):
   ```bash
   # Open the file in your editor
   vim demos.json
   ```

2. **Editing individual demo files** (`demos/demo-id.json`):
   ```bash
   # Open a specific demo file
   vim demos/my-demo.json
   ```

3. **Updating the demo index** after manual changes:
   ```bash
   node scripts/demo-section-manager.js update-all
   ```

### Updating Demo Sections

To update an existing demo section:

1. **Edit the demo file** directly or use the update command:
   ```bash
   node scripts/demo-section-manager.js update <demo-id>
   ```

2. **Validate the changes**:
   ```bash
   npm run demo:validate:all
   ```

3. **Update portfolio** after changes:
   ```bash
   npm run demo:update-portfolio
   ```

### Deleting Demo Sections

To remove a demo section:

```bash
node scripts/demo-section-manager.js delete <demo-id>
npm run demo:update-portfolio  # Update portfolio after deletion
```

## Demo Templates

The system includes reusable demo section templates:

### Available Templates

1. **Hero Section** (`templates/demo-sections/hero-section.js`)
   - Eye-catching header with title and description
   - Call-to-action buttons
   - Optional background image

2. **Demo Embed Section** (`templates/demo-sections/demo-embed-section.js`)
   - Interactive demo iframe
   - Controls for refresh and fullscreen
   - Technology badges
   - Responsive design

3. **Features Section** (`templates/demo-sections/features-section.js`)
   - Grid or list layout for features
   - Icons and descriptions
   - Highlight key capabilities

### Using Templates

Templates can be used when building custom demo pages:

```javascript
const HeroSection = require('../templates/demo-sections/hero-section');
const DemoEmbedSection = require('../templates/demo-sections/demo-embed-section');

// Create sections with custom options
const hero = new HeroSection({
  title: 'My Awesome Demo',
  subtitle: 'Interactive Experience',
  description: 'Try out this amazing demo'
});

const demoEmbed = new DemoEmbedSection({
  title: 'Interactive Demo',
  embedUrl: 'https://my-demo.example.com',
  technologies: ['React', 'Node.js']
});

// Get HTML, CSS, and JS
const heroCode = hero.getSectionCode();
const demoCode = demoEmbed.getSectionCode();
```

## Validation

The demo management system includes comprehensive validation:

### Running Validation

1. **Validate all demo sections**:
   ```bash
   npm run demo:validate:all
   ```

2. **Validate a specific demo file**:
   ```bash
   npm run demo:validate:single demos/my-demo.json
   ```

### Validation Checks

The validator checks for:
- Required fields (id, title, description, category, status)
- Valid URL formats
- Proper ID format (lowercase, numbers, hyphens only)
- Reasonable title and description lengths
- Valid status values
- Valid date formats
- Array types for technologies

### Fixing Validation Errors

Common validation errors and fixes:

1. **Missing required fields**:
   ```json
   // Add missing fields
   {
     "id": "my-demo",
     "title": "My Demo",
     "description": "A great demo",
     "category": "Web Development",
     "status": "active"
   }
   ```

2. **Invalid URLs**:
   ```json
   // Fix URL format
   "embedUrl": "https://demo.example.com"
   ```

3. **Invalid ID format**:
   ```json
   // Use only lowercase, numbers, and hyphens
   "id": "my-demo-123"
   ```

## Best Practices

### Demo Organization

1. **Use descriptive titles** that clearly indicate what the demo does
2. **Choose appropriate categories** for better organization
3. **Add relevant technologies** to help visitors find demos by tech stack
4. **Use consistent naming** for demo IDs

### Demo Content

1. **Provide clear descriptions** that explain the demo's purpose
2. **Include high-quality thumbnails** that showcase the demo
3. **Set up proper embed URLs** that work well in iframes
4. **Test demos on different devices** and screen sizes

### Performance

1. **Optimize demo performance** for fast loading
2. **Use appropriate image sizes** for thumbnails
3. **Consider lazy loading** for demo iframes
4. **Test demo responsiveness** on mobile devices

## Integration with Portfolio

The demo system integrates seamlessly with your portfolio:

### Main Portfolio Integration

1. **Demos appear in the main navigation** under "Demos"
2. **Featured demos are shown on the homepage**
3. **Demo categories are automatically generated**
4. **Technology filtering works across all demos**

### Project Integration

1. **Link demos to projects** using the same technologies
2. **Use consistent categorization** between projects and demos
3. **Cross-reference related content** for better user experience

## Troubleshooting

### Common Issues

1. **Demo not showing up**:
   - Run `node scripts/demo-section-manager.js list` to verify it exists
   - Check that status is "active"
   - Verify the demo index is up to date

2. **Embed not working**:
   - Check the embedUrl format
   - Ensure the demo allows iframe embedding
   - Verify HTTPS is used for secure embedding

3. **Validation errors**:
   - Run the validator to identify specific issues
   - Check the JSON syntax with a linter
   - Ensure all required fields are present

4. **Generated pages not updating**:
   - Rebuild demo pages with `node scripts/demo-page-builder.js build-all`
   - Check for caching issues in your browser
   - Verify the demo data is correctly formatted

### Debug Commands

```bash
# List all demos with details
npm run demo:list

# Check demo categories
npm run demo:categories

# Show featured demos
npm run demo:featured

# Validate all demos
npm run demo:validate:all

# Rebuild all demo pages
npm run demo:build-all

# Update portfolio with demos
npm run demo:update-portfolio
```

## Next Steps

1. **Create your first demo section** using the demo manager
2. **Set up your demo hosting** and get embed URLs
3. **Build demo pages** to showcase your work
4. **Customize templates** for your specific needs
5. **Integrate with your portfolio** for a seamless experience

## Advanced Usage

### Custom Demo Pages

You can create custom demo pages by combining templates:

```javascript
const DemoPageBuilder = require('../scripts/demo-page-builder');
const builder = new DemoPageBuilder();

// Build a custom demo page
await builder.buildDemoPage({
  title: 'Custom Demo Showcase',
  description: 'Hand-picked demos for specific audience',
  sections: customSectionArray,
  layout: 'grid'
});
```

### Automation

Integrate demo management into your build process:

```bash
# Add to package.json scripts
{
  "scripts": {
    "demo:validate": "npm run demo:validate:all",
    "demo:build": "npm run demo:build-all",
    "demo:deploy": "npm run demo:deploy"
  }
}
```

### API Integration

The demo data can be accessed programmatically:

```javascript
const DemoSectionManager = require('../scripts/demo-section-manager');
const manager = new DemoSectionManager();

await manager.init();
const featuredDemos = manager.getFeaturedDemoSections();
const categories = manager.getCategories();