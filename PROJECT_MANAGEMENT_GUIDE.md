# Project Management Guide

This guide explains how to create, edit, and manage project case studies for your portfolio website.

## Overview

The project management system allows you to:
- Create new project case studies with a guided CLI
- Edit existing projects using markdown files
- Automatically update the projects database
- Maintain consistent formatting across all projects

## Quick Start

### Creating a New Project

1. Run the project generator:
   ```bash
   npm run project:new
   ```

2. Follow the prompts to enter project information:
   - Project title
   - Client name (optional)
   - Category
   - Short description
   - Live demo URL (optional)
   - Repository URL (optional)
   - Development time
   - Lines of code
   - Technologies used
   - Project images

3. The system will:
   - Create a markdown file in the `projects/` directory
   - Update `projects.json` with the new project
   - Generate a project ID based on the title

### Listing Existing Projects

To see all existing projects:
```bash
npm run project:list
```

This will show:
- Project title and category
- Project ID
- Creation date
- Technologies used

## Project Structure

### Markdown File Structure

Each project is stored as a markdown file in the `projects/` directory with the following structure:

```markdown
---
title: "Project Title"
client: "Client Name (if applicable)"
date: "YYYY-MM-DD"
category: "Web Development"
technologies: ["React", "Node.js", "MongoDB"]
featured: true
thumbnail: "/assets/images/project-thumb.jpg"
liveDemo: "https://example.com"
repository: "https://github.com/user/repo"
developmentTime: "3 months"
linesOfCode: "15000"
images: [
  "/assets/images/project-1.jpg",
  "/assets/images/project-2.jpg",
  "/assets/images/project-3.jpg"
]
---

# Project Overview

Brief description of the project and its objectives.

## The Challenge

Detailed description of the problem or challenge.

## The Solution

Explanation of the technical solution and approach.

## Development Process

Step-by-step breakdown of the development process.

## Technical Implementation

Detailed technical information about the implementation.

## Results & Outcomes

Metrics, results, and impact of the project.

## Lessons Learned

Key takeaways and insights from the project.
```

### Front Matter Fields

- `title`: Project title (required)
- `client`: Client name (optional)
- `date`: Project date in YYYY-MM-DD format (auto-generated)
- `category`: Project category (required)
- `technologies`: Array of technologies used (required)
- `featured`: Whether to feature this project (boolean)
- `thumbnail`: Path to thumbnail image
- `liveDemo`: URL to live demo (optional)
- `repository`: URL to source code repository (optional)
- `developmentTime`: Development duration (e.g., "3 months")
- `linesOfCode`: Number of lines of code (e.g., "15000")
- `images`: Array of project image paths

### Content Sections

Each project should include these sections:

1. **Project Overview**: Brief description and objectives
2. **The Challenge**: Problem or challenge description
3. **The Solution**: Technical solution and approach
4. **Development Process**: Step-by-step development breakdown
5. **Technical Implementation**: Detailed technical information
6. **Results & Outcomes**: Metrics and impact
7. **Lessons Learned**: Key takeaways and insights

## Editing Projects

### Manual Editing

1. Find the project file in the `projects/` directory
2. Edit the markdown file with your preferred editor
3. Update the projects database:
   ```bash
   npm run project:update:all
   ```

### Updating a Single Project

If you've only modified one project:
```bash
npm run project:update:single <project-id>
```

Example:
```bash
npm run project:update:single ecommerce-platform
```

## Image Management

### Image Organization

Store project images in the `assets/images/` directory:

```
assets/images/
├── ecommerce-thumb.jpg
├── ecommerce-1.jpg
├── ecommerce-2.jpg
├── ecommerce-3.jpg
└── ...
```

### Image Naming Convention

Use descriptive names with the project prefix:
- `{project-id}-thumb.jpg` - Thumbnail image
- `{project-id}-1.jpg` - First project image
- `{project-id}-2.jpg` - Second project image
- etc.

### Image Optimization

- Use WebP format for better compression
- Keep thumbnails under 50KB
- Keep full images under 500KB
- Use responsive images when possible

## Best Practices

### Writing Content

1. **Be Specific**: Use concrete examples and metrics
2. **Show Process**: Document the development journey
3. **Highlight Challenges**: Explain problems and solutions
4. **Include Results**: Quantify impact when possible
5. **Share Learnings**: Be honest about what you learned

### Technical Details

1. **Architecture**: Explain system design decisions
2. **Technologies**: Justify technology choices
3. **Performance**: Include performance metrics
4. **Challenges**: Document technical hurdles
5. **Solutions**: Explain how problems were solved

### Formatting

1. **Use Headers**: Structure content with proper headers
2. **Code Blocks**: Use fenced code blocks for code
3. **Lists**: Use bullet points for readability
4. **Links**: Include relevant links and resources
5. **Images**: Add captions to images

## Automation

### Automatic Updates

The system automatically:
- Generates project IDs from titles
- Sets creation dates
- Updates the projects database
- Maintains category and technology lists

### Validation

The system validates:
- Required fields are present
- Technologies are properly formatted
- Image paths are valid
- Dates are in correct format

## Troubleshooting

### Common Issues

1. **Project not showing up**
   - Run `npm run project:update:all`
   - Check the projects.json file
   - Verify the markdown file format

2. **Images not displaying**
   - Check image paths in the markdown file
   - Verify images exist in assets/images/
   - Check file permissions

3. **Formatting issues**
   - Ensure proper markdown syntax
   - Check front matter formatting
   - Validate YAML syntax

### Debug Commands

```bash
# List all projects
npm run project:list

# Update all projects from markdown
npm run project:update:all

# Update specific project
npm run project:update:single <project-id>
```

## Integration with Website

The project management system integrates seamlessly with:

- **Project Showcase**: Displays projects on the main page
- **Project Detail Pages**: Shows full case studies
- **Filtering**: Filters by technology and category
- **Search**: Searches through project content
- **Related Projects**: Suggests similar projects

## Next Steps

1. Create your first project with `npm run project:new`
2. Add high-quality images to `assets/images/`
3. Write detailed case studies
4. Test the project display on your website
5. Iterate and improve based on feedback