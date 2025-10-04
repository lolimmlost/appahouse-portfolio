# Blog Template System Guide

This guide explains how to use the blog template system to generate blog posts from existing code and documentation.

## Overview

The blog template system provides a streamlined way to create consistent blog posts with minimal effort. It includes:

- A configurable blog system with customizable templates
- Command-line tools for generating blog posts
- Support for creating posts from existing code/documentation
- Enhanced blog renderer with additional features

## Installation

1. Install the required dependencies:
   ```bash
   npm install
   ```

2. The blog template system is now ready to use!

## Configuration

The blog system is configured through `blog-config.json`. This file contains:

- Blog metadata (title, description, author)
- Post template settings
- Available categories and tags
- Social media links
- Feature toggles

### Customizing Configuration

Edit `blog-config.json` to customize:

- Blog title and description
- Default author
- Available categories and tags
- Social media links
- Feature settings (syntax highlighting, dark mode, etc.)

## Creating Blog Posts

### Method 1: Interactive Blog Post Generator

Use the interactive generator to create a detailed blog post:

```bash
npm run blog:new
```

This will prompt you for:
- Post title
- Excerpt
- Author
- Category
- Tags
- Content sections (introduction, prerequisites, main content)
- Optional sections (code examples, tips, troubleshooting, further reading)
- Author bio

### Method 2: Generate from Existing Code/Documentation

Create a blog post from an existing file:

```bash
npm run blog:from-code
```

This will:
- Prompt for the path to a code or documentation file
- Extract content and metadata
- Generate a blog post with the file content

### Method 3: Quick Creation from Markdown

Create a quick blog post from a markdown file:

```bash
npm run blog:quick-md path/to/file.md
```

### Method 4: Quick Creation from Code File

Create a quick blog post from a code file:

```bash
npm run blog:quick-code path/to/file.js
```

### Method 5: Batch Creation

Create multiple blog posts from a directory:

```bash
npm run blog:batch path/to/directory
```

This will process all files in the directory and create blog posts from them.

## Managing Blog Posts

### List All Blog Posts

View all existing blog posts:

```bash
npm run blog:list
```

This will display:
- Post filenames
- Titles
- Publication dates

## Blog Post Structure

### Frontmatter

Each blog post includes frontmatter with metadata:

```yaml
---
title: "Post Title"
date: "2023-10-04"
excerpt: "Brief description of the post"
tags: ["Tag1", "Tag2", "Tag3"]
author: "Author Name"
category: "Category Name"
featuredImage: "https://example.com/image.jpg"
published: true
readTime: "5 min read"
---
```

### Content Sections

The blog template supports these sections:

- **Introduction**: Overview of the post
- **Prerequisites**: Requirements for following the post
- **Main Content**: The primary content of the post
- **Code Examples**: Code blocks with explanations
- **Tips and Best Practices**: Helpful tips
- **Troubleshooting**: Common issues and solutions
- **Conclusion**: Summary of the post
- **Further Reading**: Additional resources
- **Author Bio**: Information about the author

## Customizing the Blog Template

### Modifying the Template

Edit `templates/blog-post-template.md` to customize:

- Section structure
- Default content
- Formatting
- Included sections

The template uses Handlebars syntax for dynamic content:

```handlebars
{{title}} - Post title
{{date}} - Publication date
{{excerpt}} - Post excerpt
{{tags}} - Post tags
{{author}} - Post author
{{category}} - Post category
{{featuredImage}} - Featured image URL
{{introduction}} - Introduction content
{{mainContent}} - Main content
{{conclusion}} - Conclusion
```

### Conditional Sections

Use Handlebars conditional syntax for optional sections:

```handlebars
{{#if featuredImage}}
![{{title}}]({{featuredImage}})
{{/if}}

{{#if includeTableOfContents}}
## Table of Contents
...
{{/if}}
```

### Loops

Use Handlebars loop syntax for repeated content:

```handlebars
{{#each prerequisites}}
- {{this}}
{{/each}}

{{#each codeExamples}}
### {{title}}
```{{language}}
{{code}}
```
{{description}}
{{/each}}
```

## Blog Renderer Features

The enhanced blog renderer includes:

### Featured Images

Posts can include featured images that display at the top of the post and in post listings.

### Author Information

Display author names and bios in blog posts.

### Social Sharing

Built-in social sharing buttons for Twitter, LinkedIn, and GitHub.

### Table of Contents

Automatic table of contents generation for longer posts.

### Copy Code Functionality

Code blocks include copy buttons for easy code copying.

### Responsive Design

Fully responsive design that works on all devices.

### Dark Mode Support

Automatic dark mode support with system preference detection.

## Advanced Usage

### Programmatic Blog Creation

Use the blog generator programmatically:

```javascript
const BlogGenerator = require('./scripts/blog-generator');
const generator = new BlogGenerator();

// Create a blog post with custom data
const templateData = {
  title: 'My Custom Post',
  date: '2023-10-04',
  excerpt: 'A custom blog post',
  tags: ['Custom', 'Example'],
  // ... other data
};

generator.createPostFromTemplate('my-custom-post', templateData);
```

### Custom Post Types

Create custom post types by modifying the template and configuration:

1. Add new categories to `blog-config.json`
2. Create custom template sections
3. Update the blog renderer if needed

### Integration with Build Process

Integrate blog generation into your build process:

```json
{
  "scripts": {
    "build": "npm run build:css && npm run blog:generate",
    "blog:generate": "node scripts/generate-all-blogs.js"
  }
}
```

## Best Practices

### Writing Blog Posts

1. **Clear Titles**: Use descriptive, SEO-friendly titles
2. **Compelling Excerpts**: Write engaging excerpts that encourage reading
3. **Proper Tagging**: Use relevant tags to improve discoverability
4. **Code Examples**: Include practical, tested code examples
5. **Consistent Formatting**: Follow the template structure for consistency

### Managing Content

1. **Regular Updates**: Keep blog posts up to date
2. **Image Optimization**: Use optimized images for better performance
3. **SEO Optimization**: Use proper headings and meta descriptions
4. **Cross-references**: Link to related posts and resources

### File Organization

1. **Consistent Naming**: Use consistent, descriptive filenames
2. **Category Organization**: Organize posts by category
3. **Asset Management**: Keep images and assets organized

## Troubleshooting

### Common Issues

1. **Template Not Found**: Ensure `templates/blog-post-template.md` exists
2. **Config Not Found**: Ensure `blog-config.json` exists and is valid JSON
3. **Permission Errors**: Ensure write permissions for the blog directory
4. **Handlebars Errors**: Check template syntax and variable names

### Debug Mode

Enable debug mode by setting the DEBUG environment variable:

```bash
DEBUG=blog:* npm run blog:new
```

## Contributing

To contribute to the blog template system:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This blog template system is licensed under the ISC License.