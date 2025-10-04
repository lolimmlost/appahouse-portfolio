---
title: "Getting Started with Tanstack Start"
date: "2023-10-04"
excerpt: "An introduction to Tanstack Start and how to build your first application with it."
tags: ["Tanstack Start", "Tutorial", "React"]
---

# Getting Started with Tanstack Start

Tanstack Start is a modern, full-stack React framework that provides a great developer experience and excellent performance out of the box. In this post, we'll explore the basics of Tanstack Start and build a simple application.

## What is Tanstack Start?

Tanstack Start is a React framework that focuses on:
- **Developer Experience**: Intuitive APIs and great tooling
- **Performance**: Optimized for fast loading and smooth interactions
- **Full-stack Capabilities**: Seamless integration between frontend and backend
- **TypeScript Support**: First-class TypeScript support for better development

## Prerequisites

Before we start, make sure you have:
- Node.js (v16 or higher)
- npm or yarn
- Basic knowledge of React and TypeScript

## Setting Up a New Project

Let's create a new Tanstack Start project:

```bash
# Create a new directory for your project
mkdir tanstack-start-app
cd tanstack-start-app

# Initialize a new project
npm init -y

# Install Tanstack Start and its dependencies
npm install @tanstack/start @tanstack/react-router react react-dom
```

## Project Structure

A typical Tanstack Start project has the following structure:

```
tanstack-start-app/
├── src/
│   ├── components/     # Reusable components
│   ├── routes/        # Route components
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── package.json
```

## Creating Your First Route

Let's create a simple home page:

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div>
      <h1>Welcome to Tanstack Start!</h1>
      <p>This is your first Tanstack Start application.</p>
    </div>
  )
}
```

## Setting Up the Router

Now, let's set up the router in our main file:

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

## Adding Navigation

Let's create a navigation component:

```tsx
// src/components/Navigation.tsx
import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  )
}
```

## Creating Additional Routes

Let's create an about page:

```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is a simple about page.</p>
    </div>
  )
}
```

## Styling Your Application

Tanstack Start doesn't come with a built-in styling solution, but you can easily integrate your preferred CSS framework. Here's how to add Tailwind CSS:

```bash
# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then, configure your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Finally, add the Tailwind directives to your CSS:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Running Your Application

To run your Tanstack Start application in development mode:

```bash
npm run dev
```

This will start the development server, and you can view your application at `http://localhost:3000`.

## Building for Production

When you're ready to deploy your application, run:

```bash
npm run build
```

This will create an optimized production build in the `dist` directory.

## Conclusion

Tanstack Start is a powerful framework for building modern React applications. With its intuitive APIs, excellent performance, and full-stack capabilities, it's a great choice for your next project.

In this post, we've covered the basics of setting up a Tanstack Start project, creating routes, adding navigation, and styling your application. There's much more to explore, including data fetching, server-side rendering, and more.

Happy coding!