# AppaHouse Portfolio

A minimalist, static portfolio website to showcase full-stack Tanstack Start apps and Docker-deployed applications with case studies, live demos, and an inquiry form.

## Features

- Responsive design that works on all devices
- Dark mode toggle with system preference detection
- GitHub activity visualization
- Skills section with progress indicators
- Project showcase with tech stack tags
- Case studies section
- Live demos section
- Blog section
- Contact form with validation and spam protection
- Professional networking links with hover effects
- Fast loading times and optimized performance

## Tech Stack

- **Frontend**: HTML5, JavaScript (ES6+)
- **Styling**: Tailwind CSS framework
- **Icons**: Lucide React icons
- **Dark Mode**: Tailwind dark mode with toggle
- **GitHub Integration**: GitHub API for commit history visualization
- **Contact Form**: Formspree integration for email handling
- **Package Manager**: NPM for dependency management
- **Hosting**: Cloudflare Zero Trust Tunnels
- **Domain**: appahouse.com

## Getting Started

### Prerequisites

- Node.js and NPM installed on your machine

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/appahouse-portfolio.git
   cd appahouse-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up configuration files:
   - Copy example configuration files:
     ```bash
     cp config/contact-config.example.js config/contact-config.js
     cp config/github-config.example.js config/github-config.js
     ```
   - Edit the copied files with your actual values:
     - Replace `YOUR_FORMSPREE_ID` with your Formspree ID in `config/contact-config.js`
     - Replace `YOUR_GITHUB_USERNAME` with your GitHub username in `config/github-config.js`
     - Update contact information and social links in `config/contact-config.js`
   - For detailed setup instructions, see [CONFIG_SETUP.md](CONFIG_SETUP.md)

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   This will compile Tailwind CSS and watch for changes.

2. Open `index.html` in your browser to view the portfolio.

### Building for Production

1. Build the CSS:
   ```bash
   npm run build
   ```
   This will compile Tailwind CSS to `css/output.css`.

2. Deploy the `index.html`, `css/output.css`, and `js/` files to your hosting provider.

## Blog Management

This portfolio includes a comprehensive blog system with markdown-based posts and automated generation tools.

### Creating Blog Posts

The blog system provides multiple ways to create new posts:

#### Method 1: Interactive Blog Post Generator
Create a detailed blog post with the interactive generator:
```bash
npm run blog:new
```
This will prompt you for:
- Post title and excerpt
- Author and category
- Tags
- Content sections (introduction, prerequisites, main content)
- Optional sections (code examples, tips, troubleshooting, further reading)
- Author bio

#### Method 2: Generate from Existing Code/Documentation
Create a blog post from an existing file:
```bash
npm run blog:from-code
```

#### Method 3: Quick Creation from Markdown
Create a quick blog post from a markdown file:
```bash
npm run blog:quick-md path/to/file.md
```

#### Method 4: Quick Creation from Code File
Create a quick blog post from a code file:
```bash
npm run blog:quick-code path/to/file.js
```

#### Method 5: Batch Creation
Create multiple blog posts from a directory:
```bash
npm run blog:batch path/to/directory
```

### Managing Blog Posts

#### List All Blog Posts
View all existing blog posts:
```bash
npm run blog:list
```

#### Update Blog Index
Update the blog index file with the latest posts:
```bash
npm run blog:update-index
```

#### Blog Post Structure
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

### Blog Configuration

Customize the blog system by editing `blog-config.json`:
- Blog title and description
- Default author
- Available categories and tags
- Social media links
- Feature settings

For detailed documentation on the blog system, see [BLOG_TEMPLATE_GUIDE.md](BLOG_TEMPLATE_GUIDE.md).

## Case Studies Management

This portfolio includes a dynamic case studies system similar to the blog system.

### Creating Case Studies

Create a new case study with the interactive generator:
```bash
npm run case-study:new
```
This will prompt you for:
- Case study title and category
- Client information
- Project overview, challenge, and solution
- Development process and technical implementation
- Results and lessons learned
- Technologies used
- Live demo and repository links

### Managing Case Studies

#### List All Case Studies
View all existing case studies:
```bash
npm run case-study:list
```

#### Update Case Studies from Markdown
Update the case studies index from markdown files:
```bash
npm run case-study:update
```

### Case Study Structure

Each case study includes metadata in `case-studies.json`:
- Title, category, and client information
- Technologies and development metrics
- Live demo and repository links
- Detailed content sections

## Customization

### Contact Form Configuration

Edit `config/contact-config.js` to:
- Update your Formspree form ID
- Change contact information (email, location, availability, preferred contact method)
- Update social media links (GitHub, LinkedIn, Twitter)
- Configure resume download link

For detailed setup instructions, see `docs/FORMSPREE_SETUP.md` and [CONFIG_SETUP.md](CONFIG_SETUP.md).

### Personal Information

1. Update the personal information in `index.html`:
   - Name in the header
   - Hero section content
   - Skills and their percentages
   - Project information

### GitHub Integration

1. Update your GitHub username in `config/github-config.js`:
   ```javascript
   username: 'YOUR_GITHUB_USERNAME',
   ```
   The GitHub API integration will automatically use this configuration.

### Styling

1. Customize the color scheme in `tailwind.config.js`:
   ```javascript
   theme: {
     extend: {
       colors: {
         primary: {
           // Your custom color palette
         }
       }
     }
   }
   ```

2. Add custom styles in `css/input.css`:
   ```css
   @layer components {
     .your-custom-class {
       /* Your custom styles */
     }
   }
   ```

## Deployment

### Cloudflare Zero Trust Tunnels

1. Install Cloudflared:
   ```bash
   # On macOS
   brew install cloudflared
   
   # On Windows (using Chocolatey)
   choco install cloudflared
   
   # On Linux
   # Follow instructions at https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. Authenticate Cloudflared:
   ```bash
   cloudflared tunnel login
   ```

3. Create a tunnel:
   ```bash
   cloudflared tunnel create appahouse
   ```

4. Configure the tunnel:
   ```bash
   # Create a config file at ~/.cloudflared/config.yml
   tunnel: your-tunnel-id
   credentials-file: ~/.cloudflared/<tunnel-id>.json
   
   ingress:
     - hostname: appahouse.com
       service: http://localhost:8000
     - service: http_status:404
   ```

5. Start the tunnel:
   ```bash
   cloudflared tunnel run appahouse
   ```

6. Set up DNS records for your domain to point to the tunnel.

### Other Hosting Options

The portfolio can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Traditional web hosting

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you have any questions or issues, please open an issue on the GitHub repository.