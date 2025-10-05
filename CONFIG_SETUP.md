# Configuration Setup Guide

This guide explains how to set up the configuration files for your portfolio website while keeping sensitive information secure.

## Overview

The portfolio uses configuration files to store sensitive information like API keys, form IDs, and personal details. These files are not committed to version control to prevent leaking secrets.

## Configuration Files

### 1. Contact Configuration

**File**: `config/contact-config.js`  
**Example**: `config/contact-config.example.js`

Contains:
- Formspree form ID for contact form
- Personal contact information
- Social media links
- Resume download URL

**Setup**:
1. Copy the example file:
   ```bash
   cp config/contact-config.example.js config/contact-config.js
   ```

2. Edit `config/contact-config.js` and replace the placeholder values:
   - Replace `YOUR_FORMSPREE_ID` with your actual Formspree form ID
   - Update email, location, and social media links
   - Add your resume URL if available

### 2. GitHub Configuration

**File**: `config/github-config.js`  
**Example**: `config/github-config.example.js`

Contains:
- GitHub username for API integration
- Cache configuration

**Setup**:
1. Copy the example file:
   ```bash
   cp config/github-config.example.js config/github-config.js
   ```

2. Edit `config/github-config.js` and replace:
   - Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username

## Security Best Practices

### .gitignore Configuration

The following files are automatically ignored by Git:
- `config/contact-config.js`
- `config/github-config.js`
- `config/api-keys.js`
- `config/secrets.js`

Example files (with `.example.js` extension) are kept in version control as templates.

### Environment-Specific Configurations

For different environments (development, staging, production), consider:

1. **Using environment variables** for highly sensitive data:
   ```javascript
   const config = {
     apiKey: process.env.API_KEY || 'fallback-value'
   };
   ```

2. **Multiple configuration files**:
   - `config/development.js`
   - `config/production.js`
   - Load the appropriate one based on environment

3. **Server-side configuration** for production:
   - Store sensitive values in server environment variables
   - Inject them into the frontend at build time

## Additional Configuration Files

You may want to create additional configuration files for:

### API Keys Configuration
```bash
cp config/github-config.example.js config/api-keys.example.js
# Edit to include various API keys
cp config/api-keys.example.js config/api-keys.js
```

### Analytics Configuration
```bash
cp config/github-config.example.js config/analytics.example.js
# Edit to include Google Analytics, etc.
cp config/analytics.example.js config/analytics.js
```

## Deployment Considerations

### Static Hosting (GitHub Pages, Netlify, Vercel)

1. **Build-time injection**: Use build scripts to replace placeholders
2. **Environment variables**: Use platform-specific environment variables
3. **Edge functions**: Use serverless functions for sensitive operations

### Traditional Hosting

1. **Server-side rendering**: Generate config on the server
2. **Reverse proxy**: Inject configuration at the proxy level
3. **Secure endpoints**: Fetch configuration from secure endpoints

## Troubleshooting

### Configuration Not Loading

1. Check browser console for errors
2. Verify script tags are in correct order in HTML
3. Ensure configuration files exist and are properly formatted

### GitHub API Not Working

1. Verify GitHub username is correct
2. Check API rate limits
3. Ensure CORS is properly configured

### Contact Form Not Working

1. Verify Formspree ID is correct
2. Check Formspree dashboard for form status
3. Ensure form is properly configured

## Template Files

Always keep example files up to date when adding new configuration options. They serve as documentation and templates for new developers.

## Security Checklist

- [ ] Never commit actual configuration files to version control
- [ ] Use different values for development and production
- [ ] Regularly rotate API keys and secrets
- [ ] Limit API permissions to minimum required
- [ ] Monitor for leaked credentials
- [ ] Use HTTPS for all API calls
- [ ] Validate all configuration values on load

## Support

If you encounter issues with configuration:

1. Check the browser console for error messages
2. Verify file paths and permissions
3. Ensure all required configuration files exist
4. Review this documentation for common issues