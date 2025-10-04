---
title: "AIDI - Self Hosted Music Reccomendations"
date: "2025-10-04"
excerpt: "Learn how to deploy and connect Navidrome, Ollama, and Lidarr for automated music discovery and playback with ai reccomendations"
tags: [&quot;Ollama&quot;, &quot;AI&quot;, &quot;Navidrome&quot;, &quot;Lidarr&quot;, &quot;Tanstack Start&quot;, &quot;Postgress&quot;, &quot;Drizzle ORM&quot;, &quot;NPM&quot;, &quot;Recommendations&quot;]
author: "Juan"
category: "Case Study"
featuredImage: ""
published: true
readTime: "5 min read"
---

# AIDI - Self Hosted Music Reccomendations


## Introduction

In this post, we&#x27;ll explore the AIDI - Self Hosted Music Reccomendations implementation and key concepts.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Main Content](#main-content)
- [Conclusion](#conclusion)

## Prerequisites

Before we begin, make sure you have:

- Basic understanding of the subject

## Main Content

# AIDJ - AI-Assisted Music Library &amp; Dashboard

AIDJ (AI-assisted DJ) is a modern web application for managing and exploring your self-hosted music library. It provides a dashboard for configuration, user authentication, and a searchable music library integrated with Navidrome for streaming. AI-powered recommendations via Ollama are planned for future enhancements. All services run locally for privacy.

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Project Overview

This application provides a unified interface for music management using local self-hosted services:
- Navidrome for music library browsing and streaming
- Planned: Ollama for AI-powered music recommendations

All services run on your local network, ensuring your music data stays private.

## Getting Started

We use **npm** by default.

1. Clone this repository:

   &#x60;&#x60;&#x60;bash
   git clone &lt;repository-url&gt;
   cd aidj
   &#x60;&#x60;&#x60;

2. Install dependencies:

   &#x60;&#x60;&#x60;bash
   npm install
   &#x60;&#x60;&#x60;

3. Create a &#x60;.env&#x60; file based on the environment variables documented in [environment-configuration.md](./docs/environment-configuration.md).

4. Push the schema to your database with drizzle-kit:

   &#x60;&#x60;&#x60;bash
   npm run db:push
   &#x60;&#x60;&#x60;

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   &#x60;&#x60;&#x60;bash
   npm run dev
   &#x60;&#x60;&#x60;

The development server should now be running at [http://localhost:3000](http://localhost:3000).

## CI/CD Pipeline

This project includes automated CI/CD workflows using GitHub Actions that run on every push to &#x60;main&#x60; and pull requests. The pipeline ensures code quality through:

### What the Pipeline Does
- **Linting**: Runs ESLint to enforce code standards
- **Building**: Compiles the project with Vite
- **Testing**: Executes unit tests with Vitest, requiring &gt;80% code coverage
- **Security Scanning**: Uses Trivy for vulnerability detection and Gitleaks for secret scanning
- **Coverage Reporting**: Uploads results to Codecov for detailed analysis

### Viewing Pipeline Results
- **Actions Tab**: View build and test results in the GitHub &quot;Actions&quot; tab
- **Security Tab**: Review vulnerability and secret scan alerts
- **Coverage**: Access detailed reports at [codecov.io](https://codecov.io) (requires &#x60;CODECOV_TOKEN&#x60; secret setup)

### Required Repository Secrets
For full CI/CD functionality, add these secrets in GitHub Settings &gt; Secrets and variables &gt; Actions:
- &#x60;CODECOV_TOKEN&#x60;: For coverage report uploads (get from Codecov dashboard)

### Local Workflow Replication
Run these commands locally to match the CI environment:
&#x60;&#x60;&#x60;bash
pnpm install
pnpm lint
pnpm test:coverage  # Requires &gt;80% coverage
pnpm build
pnpm check-types
&#x60;&#x60;&#x60;

For detailed workflow configuration, see [.github/workflows/README.md](.github/workflows/README.md).

## Configuration

Before running the application, you&#x27;ll need to configure the following services in your &#x60;.env&#x60; file:

1. Navidrome service URL and credentials
2. Database connection (PostgreSQL)
3. Planned: Ollama service URL for AI features

## Project Structure

&#x60;&#x60;&#x60;
src/
├── components/           # Shared UI components (using shadcn/ui)
├── lib/                  # Core utilities and services
│   ├── auth/             # Better Auth implementation
│   ├── db/               # Drizzle ORM setup and schema
│   ├── config/           # App configuration
│   ├── services/         # External service integrations (e.g., Navidrome)
│   └── stores/           # State management (e.g., audio player)
├── routes/               # TanStack Router file-based routes
│   ├── (auth)/           # Login/Signup routes
│   ├── api/              # API endpoints (auth, Navidrome proxy/streaming)
│   ├── dashboard/        # Main dashboard
│   ├── config/           # Configuration page
│   └── library/          # Music library (artists, search, albums)
└── styles.css            # Global Tailwind CSS
&#x60;&#x60;&#x60;

## Features

- User authentication with Better Auth (login/signup)
- Music library browsing: artists, albums, search via Navidrome
- Audio streaming with custom player
- Dashboard for app overview
- Configuration interface for services
- Responsive UI with dark mode support (shadcn/ui + Tailwind)
- Planned: AI music recommendations via Ollama

## License

Code in this template is public domain via [Unlicense](./LICENSE).

## Development Workflow

### Pre-commit Checks
The project uses ESLint and Prettier for consistent code style. Consider using a pre-commit hook or run these before pushing:
&#x60;&#x60;&#x60;bash
pnpm lint:fix
pnpm format
pnpm test
&#x60;&#x60;&#x60;

### Testing
Unit tests are written with Vitest and React Testing Library. Run tests with:
&#x60;&#x60;&#x60;bash
pnpm test          # Run tests in watch mode
pnpm test:coverage # Run with coverage reporting
pnpm test:ui       # Run with Vitest UI
&#x60;&#x60;&#x60;

Add new tests in &#x60;src/components/__tests__/&#x60; or alongside components. Coverage reports are generated in the &#x60;coverage/&#x60; directory.

## Backlog Progress

- Story 1.1: Project Setup and Basic Structure — Completed
- Story 1.2: User Authentication System — Completed
- Story 1.3: Service Configuration Interface — Completed
- Story 1.4: Local Development Environment Setup — Completed
- Story 1.5: Basic CI/CD Pipeline — Completed
- Story 1.6: Secrets Management &amp; Security Baseline — Completed
- Epic 2: Music Library Integration — Completed (Navidrome API, Library UI, Audio Streaming &amp; Player, Dashboard)
- Story 2.1: AI Recommendations with Ollama — Planned

## Contributing

Contributions are welcome. Please follow the project&#x27;s conventions and add new tasks to the backlog as needed.


## Code Examples


## Tips and Best Practices


## Troubleshooting


## Conclusion

This concludes our exploration of AIDI - Self Hosted Music Reccomendations. Feel free to experiment with the code and adapt it to your needs.

## Further Reading


