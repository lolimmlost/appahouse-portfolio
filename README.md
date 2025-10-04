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
- Contact form with validation
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

## Customization

### Personal Information

1. Update the personal information in `index.html`:
   - Name in the header
   - Hero section content
   - Skills and their percentages
   - Project information
   - Contact form action URL (replace with your Formspree ID)

### GitHub Integration

1. In `js/github-api.js`, replace `your-username` with your GitHub username:
   ```javascript
   const githubUsername = 'your-username';
   ```

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