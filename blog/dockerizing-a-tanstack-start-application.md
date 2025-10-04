---
title: "Dockerizing a Tanstack Start Application"
date: "2023-09-28"
excerpt: "Learn how to containerize your Tanstack Start application using Docker for easy deployment."
tags: ["Docker", "DevOps", "Tanstack Start"]
---

# Dockerizing a Tanstack Start Application

Docker has become an essential tool in modern web development, providing a consistent environment for applications from development to production. In this post, we'll explore how to Dockerize a Tanstack Start application for seamless deployment.

## Why Docker?

Before we dive into the implementation, let's understand why Docker is beneficial:

- **Consistency**: Ensures your application runs the same way everywhere
- **Isolation**: Prevents conflicts between dependencies
- **Scalability**: Makes it easy to scale your application horizontally
- **Portability**: Run your application anywhere Docker is supported
- **Version Control**: Version your entire application stack

## Prerequisites

Make sure you have:
- Docker installed on your system
- A working Tanstack Start application (see our previous post)
- Basic knowledge of Docker concepts

## Creating a Dockerfile

Let's start by creating a Dockerfile in the root of your Tanstack Start project:

```dockerfile
# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

## Creating a .dockerignore File

To optimize the build process and keep the Docker image small, create a `.dockerignore` file:

```
# .dockerignore

Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.next
.git
.gitignore
```

## Building the Docker Image

Now, let's build the Docker image:

```bash
docker build -t tanstack-start-app .
```

## Running the Docker Container

Once the image is built, you can run it as a container:

```bash
docker run -p 3000:3000 tanstack-start-app
```

Your application should now be accessible at `http://localhost:3000`.

## Using Docker Compose

For more complex setups, especially when your application depends on other services like databases, Docker Compose is a great tool. Let's create a `docker-compose.yml` file:

```yaml
# docker-compose.yml

version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydatabase
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

To run the application with Docker Compose:

```bash
docker-compose up -d
```

This will start both your application and the database in detached mode.

## Multi-Stage Builds for Optimization

The Dockerfile we created earlier uses multi-stage builds, which is a best practice for creating optimized Docker images. Here's why it's beneficial:

1. **Smaller Image Size**: By separating the build environment from the runtime environment, we only include what's necessary to run the application.

2. **Better Security**: The final image doesn't contain build tools or development dependencies, reducing the attack surface.

3. **Faster Deployment**: Smaller images mean faster pull and deployment times.

## Environment Variables in Docker

To manage environment variables in Docker, you can:

1. Use the `-e` flag when running the container:
   ```bash
   docker run -e "NODE_ENV=production" -p 3000:3000 tanstack-start-app
   ```

2. Use an environment file:
   ```bash
   docker run --env-file .env.production -p 3000:3000 tanstack-start-app
   ```

3. Define them in your docker-compose.yml file:
   ```yaml
   services:
     app:
       environment:
         - NODE_ENV=production
         - DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydatabase
   ```

## Health Checks

Adding health checks to your Docker container helps monitoring systems determine if your application is running correctly:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## Deployment to Cloud Services

Once your application is containerized, deploying to cloud services becomes much easier. Here are some options:

### Docker Hub

Push your image to Docker Hub for easy distribution:

```bash
docker tag tanstack-start-app yourusername/tanstack-start-app:latest
docker push yourusername/tanstack-start-app:latest
```

### AWS ECS

Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to run and scale containerized applications.

### Google Cloud Run

Google Cloud Run is a fully managed serverless platform that automatically scales your containerized applications.

### Azure Container Instances

Azure Container Instances provides a quick and simple way to run containers in Azure without having to manage the underlying infrastructure.

## Conclusion

Dockerizing your Tanstack Start application provides numerous benefits, from consistent environments to easier deployment and scaling. By following the steps outlined in this post, you can containerize your application and take advantage of the powerful ecosystem that Docker offers.

Remember to optimize your Docker images, use environment variables for configuration, and consider using Docker Compose for multi-container applications. Happy containerizing!