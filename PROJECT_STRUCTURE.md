# AppaHouse Portfolio - Project Structure

This document provides an overview of the project structure for the AppaHouse Portfolio website.

## Directory Structure

```
appahouse-portfolio/
├── assets/                 # Static assets (images, icons, etc.)
│   ├── icons/             # Icon files
│   └── images/            # Image files
├── blog/                  # Blog posts (markdown files)
├── components/            # Reusable components
│   └── blog-renderer.js   # Blog post rendering component
├── css/                   # Stylesheets
│   ├── input.css         # Tailwind CSS input file
│   └── output.css        # Compiled CSS (generated)
├── js/                    # JavaScript files
│   ├── dark-mode.js      # Dark mode toggle functionality
│   ├── form-handler.js   # Contact form handling
│   ├── github-api.js     # GitHub API integration
│   └── main.js           # Main JavaScript functionality
├── projects/              # Project documentation and assets
├── .gitignore            # Git ignore rules
├── index.html            # Main HTML file
├── package.json          # NPM package configuration
├── postcss.config.js     # PostCSS configuration
├── README.md             # Project documentation
├── setup.js              # Setup script
└── tailwind.config.js    # Tailwind CSS configuration
```

## Key Files

### `package.json`
Contains project metadata, dependencies, and NPM scripts. Key scripts include:
- `build:css`: Compiles Tailwind CSS and watches for changes
- `build`: Compiles Tailwind CSS once
- `dev`: Runs the development server
- `start`: Builds the project for production

### `index.html`
The main HTML file that serves as the entry point for the portfolio website. It includes:
- Header with navigation
- Hero section
- Skills section
- Projects section
- Case studies section
- Live demos section
- Blog section
- Contact form
- Footer

### `tailwind.config.js`
Configuration file for Tailwind CSS. It includes:
- Content sources for Tailwind to scan
- Dark mode configuration
- Custom color palette
- Custom typography settings
- Extended theme configuration

### `postcss.config.js`
Configuration file for PostCSS, which processes CSS with Tailwind and Autoprefixer.

### `css/input.css`
The main CSS input file that imports Tailwind's base, components, and utilities styles, along with custom styles.

### `js/main.js`
Main JavaScript file that handles:
- Mobile menu toggle
- Smooth scrolling
- Header scroll effects
- Skill bar animations

### `js/dark-mode.js`
JavaScript file that implements dark mode functionality:
- Toggles dark mode
- Saves user preference to localStorage
- Respects system color scheme preference

### `js/github-api.js`
JavaScript file that integrates with the GitHub API to:
- Fetch user events
- Display commit history visualization
- Show top repositories by commit count

### `js/form-handler.js`
JavaScript file that handles the contact form:
- Form validation
- Form submission
- Success/error message display

### `components/blog-renderer.js`
Component that renders blog posts:
- Loads blog posts from markdown files
- Renders blog post listings
- Renders individual blog posts
- Simple markdown to HTML conversion

### `setup.js`
Setup script that:
- Installs NPM dependencies
- Builds Tailwind CSS
- Provides setup instructions

### `.gitignore`
Specifies files and directories that should be ignored by Git.

## Getting Started

1. Clone the repository
2. Run the setup script: `node setup.js`
3. Start development: `npm run dev`
4. Open `index.html` in your browser

## Customization

### Personal Information
Update the following files with your personal information:
- `index.html`: Update name, hero section content, skills, projects, etc.
- `js/github-api.js`: Replace `your-username` with your GitHub username

### Styling
- Modify `tailwind.config.js` to customize the color scheme and other theme settings
- Add custom styles in `css/input.css`

### Content
- Add blog posts in the `blog/` directory
- Add project documentation in the `projects/` directory
- Update assets in the `assets/` directory

## Deployment

The portfolio can be deployed to any static hosting service:
1. Build the project: `npm run build`
2. Upload the following files to your hosting provider:
   - `index.html`
   - `css/output.css`
   - `js/` directory
   - `assets/` directory
   - `components/` directory

For more detailed deployment instructions, see the README.md file.