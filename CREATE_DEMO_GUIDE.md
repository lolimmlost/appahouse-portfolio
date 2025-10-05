# How to Create a New Demo

This guide will walk you through creating a new live demo for your portfolio using the demo management system.

## Quick Start

### Step 1: Create a New Demo Section

Run the interactive demo creator:

```bash
npm run demo:new
```

This will start an interactive prompt that asks for:

1. **Demo title** - The name of your demo
2. **Demo description** - Brief description of what the demo does
3. **Category** - Category to organize your demo (e.g., "E-commerce", "Productivity")
4. **Technologies** - Comma-separated list of technologies used
5. **Embed URL** - URL where your demo is hosted (for iframe embedding)
6. **Fullscreen URL** - URL for opening demo in fullscreen
7. **Thumbnail path** - Path to thumbnail image
8. **Feature this demo?** - Whether to feature on the main page

### Example Walkthrough

Here's what creating a demo looks like:

```bash
$ npm run demo:new

🎬 Create New Demo Section

Demo title: Weather Dashboard
Demo description: Interactive weather dashboard with real-time data and forecasts
Category: Data Visualization
Technologies (comma-separated): React, Chart.js, OpenWeather API
Embed URL (optional): https://weather-demo.example.com/embed
Fullscreen URL (optional): https://weather-demo.example.com
Thumbnail path (optional): /assets/images/weather-dashboard-thumb.jpg
Feature this demo? (y/N): y

✅ Demo section created successfully!

Demo details:
  ID: weather-dashboard
  Title: Weather Dashboard
  Category: Data Visualization
  Technologies: React, Chart.js, OpenWeather API
  Featured: Yes

Next steps:
1. Add your demo thumbnail to: /assets/images/weather-dashboard-thumb.jpg
2. Host your demo and update the embed URL
   - For local development: Start with `npm run demo:dev-server` and use `http://localhost:3001/`
   - For production: Use your deployed demo URL
3. Build demo pages with: npm run demo:build-all
4. Update portfolio: npm run demo:update-portfolio
5. Validate with: npm run demo:validate:all
```

## Step 2: Prepare Your Demo Assets

### Thumbnail Image
Add your thumbnail to the specified path (default: `/assets/images/`):

```bash
# Place your thumbnail in the assets/images directory
cp my-thumbnail.jpg assets/images/weather-dashboard-thumb.jpg
```

### Demo Hosting
Host your demo somewhere accessible via HTTPS. Options include:
- GitHub Pages
- Netlify
- Vercel
- Your own server

### Local Development with CORS Support

**For local development**, use the built-in CORS-enabled demo server:

```bash
# Start demo server on port 3001
npm run demo:dev-server

# Or use different ports for multiple demos
npm run demo:dev-server:3002
npm run demo:dev-server:3003
```

This automatically handles CORS issues and allows your demos to work in iframe embeds.

## Step 3: Build Demo Pages

Generate the demo pages with your new demo:

```bash
npm run demo:build-all
```

This creates:
- Featured demos page
- Category-specific pages
- Complete demo index
- Individual demo pages

Generated files are saved in the `generated-demos/` directory.

## Step 4: Update Your Portfolio

This is the crucial step! Update your main portfolio page to show the new demo:

```bash
npm run demo:update-portfolio
```

This updates your main `index.html` file with the new demo sections.

## Step 5: Validate Your Demo

Check that everything is working correctly:

```bash
npm run demo:validate:all
```

This will validate:
- Required fields are present
- URLs are properly formatted
- Data structure is correct

## Step 6: View Your Demo

Now you can see your demo in two places:

1. **Main Portfolio Page** - Start your dev server and check the demos section:
   ```bash
   npm run dev
   ```
   Then navigate to the demos section in your portfolio

2. **Generated Demo Pages** - Open the standalone demo pages:
   ```bash
   # Open the featured demos page
   open generated-demos/featured-demos.html

   # Or open the demo index
   open generated-demos/index.html
   ```

## Managing Existing Demos

### List All Demos
```bash
npm run demo:list
```

### View Categories
```bash
npm run demo:categories
```

### View Featured Demos
```bash
npm run demo:featured
```

### Update a Demo
You can update demo information by editing the JSON files directly:

1. Edit `demos/demo-id.json` (individual demo file)
2. Or edit `demos.json` (main index)
3. Rebuild pages: `npm run demo:build-all`
4. Update portfolio: `npm run demo:update-portfolio`

### Delete a Demo
```bash
node scripts/demo-section-manager.js delete <demo-id>
npm run demo:update-portfolio  # Update portfolio after deletion
```

### Running Multiple Demos Locally

For local development with multiple demos on different ports:

```bash
# Terminal 1 - Demo 1
npm run demo:dev-server

# Terminal 2 - Demo 2
npm run demo:dev-server:3002

# Terminal 3 - Demo 3
npm run demo:dev-server:3003
```

Then create demo sections with their respective URLs:
- Demo 1: `http://localhost:3001/`
- Demo 2: `http://localhost:3002/`
- Demo 3: `http://localhost:3003/`

## Demo File Structure

When you create a demo, the system creates:

```
demos/
├── weather-dashboard.json    # Individual demo file
└── assets/                   # Demo assets

demos.json                    # Main demo index
generated-demos/              # Built demo pages
├── index.html               # Demo index page
├── featured-demos.html      # Featured demos
├── all-demos.html          # All demos
└── data-visualization-demos.html  # Category page
```

## Tips for Great Demos

### Demo Content
- **Keep it focused** - Showcase one main feature or capability
- **Make it interactive** - Allow users to interact with your demo
- **Provide context** - Include instructions or tooltips
- **Optimize performance** - Ensure fast loading

### Technical Requirements
- **HTTPS required** - Demos must be served over HTTPS for iframe embedding
- **Responsive design** - Ensure demo works on mobile devices
- **Cross-browser compatible** - Test in different browsers
- **No console errors** - Check browser console for issues

### Embedding Best Practices
- **Set proper dimensions** - Design for iframe containers
- **Avoid pop-ups** - Don't use window.open() or alerts
- **Handle messages** - Listen for parent window communication if needed
- **Provide fallbacks** - Show placeholder if demo fails to load

## Troubleshooting

### Demo Not Showing Up
1. Check that status is "active" in the demo JSON
2. Verify embed URL is accessible
3. Run `npm run demo:validate:all` to check for errors

### Embed Not Working
1. Ensure demo URL uses HTTPS
2. Check that demo allows iframe embedding
3. Verify no console errors in the demo

### Build Issues
1. Clear generated-demos directory: `rm -rf generated-demos/`
2. Rebuild: `npm run demo:build-all`
3. Update portfolio: `npm run demo:update-portfolio`
4. Check for validation errors: `npm run demo:validate:all`

### CORS Issues
1. Use the demo dev server: `npm run demo:dev-server`
2. Ensure demo URLs are accessible from your portfolio
3. Check browser console for specific CORS errors
4. See [CORS_DEVELOPMENT_GUIDE.md](CORS_DEVELOPMENT_GUIDE.md) for detailed troubleshooting

## Integration with Portfolio

Your demos will automatically appear in:
- Main portfolio navigation under "Demos"
- Homepage featured demos section
- Category-based filtering
- Technology-based filtering

The demo system integrates seamlessly with your existing project management system, using similar patterns for organization and validation.