# Demo Management Workflow Guide

This guide explains the complete workflow for managing demos in your portfolio.

## Demo Management Commands

### Creating and Managing Demos
- `npm run demo:new` - Create a new demo interactively
- `npm run demo:update` - Update an existing demo interactively
- `npm run demo:delete` - Delete a demo interactively
- `npm run demo:list` - List all existing demos

### Building Demo Pages
- `npm run demo:build` - Build a single demo page interactively
- `npm run demo:build-all` - Build all demo pages (featured, by category, all)
- `npm run demo:index` - Generate the demo index page (for generated-demos directory)

### Updating Your Portfolio
- `npm run demo:update-portfolio` - ⭐ **IMPORTANT**: Updates the main index.html with your demos
- `npm run demo:validate:all` - Validate all demo configurations
- `npm run demo:validate:single` - Validate a specific demo file

## Complete Workflow

### 1. Create or Update a Demo
```bash
# Create a new demo
npm run demo:new

# OR update an existing demo
npm run demo:update
```

### 2. Build Demo Pages
```bash
# Build all demo pages
npm run demo:build-all
```

### 3. Update Main Portfolio (CRITICAL STEP)
```bash
# This updates your main index.html with the latest demos
npm run demo:update-portfolio
```

### 4. Validate Everything
```bash
# Validate all demos
npm run demo:validate:all
```

## Important Notes

- `npm run demo:index` only updates the demo directory index, NOT your main portfolio
- `npm run demo:update-portfolio` is the command that updates your main index.html file
- Always run `npm run demo:update-portfolio` after making changes to demos
- The demo preview size issue is handled separately (see below)

## Demo Preview Size Issue

If your demo preview gets smaller after updating the portfolio, this is because the `update-portfolio` script uses a default aspect ratio. To maintain the larger preview size:

1. After running `npm run demo:update-portfolio`
2. Manually edit the `index.html` file to change the iframe container height
3. Look for the demo section and change from `aspect-w-16 aspect-h-9` to `style="height: 500px;"`

## Fullscreen URL Configuration

You can configure separate URLs for embedding vs fullscreen viewing:

- `embedUrl`: Used for the iframe embed in your portfolio
- `fullscreenUrl`: Used for the fullscreen button (opens in new tab)

If `fullscreenUrl` is not set, the fullscreen button will use the `embedUrl` as fallback.

Example demo configuration:
```json
{
  "id": "my-demo",
  "title": "My Demo",
  "embedUrl": "http://10.0.0.30:4173",
  "fullscreenUrl": "http://10.0.0.30:4173?fullscreen=true"
}
```

## Troubleshooting

**Demo not showing on main page?**
- Run `npm run demo:update-portfolio`
- Check that the demo has `"featured": true` in its configuration

**Demo showing wrong URL?**
- Update both `demos/[demo-name].json` AND `demos.json`
- Run `npm run demo:build-all` then `npm run demo:update-portfolio`

**Demo preview too small?**
- The system now automatically uses 600px height for better visibility
- If still too small, manually edit index.html to increase iframe height

**Fullscreen button not working?**
- Check that your demo has either `embedUrl` or `fullscreenUrl` configured
- The fullscreen button opens the demo in a new tab, not browser fullscreen mode