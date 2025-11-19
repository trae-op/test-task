## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Local Development](#local-development)
- [Docker Development](#docker-development)
- [GitHub Actions Deployment](#github-actions-deployment)

## Overview

`test-task` is an operations dashboard for managing the lifecycle of products and orders. The app supports product catalog maintenance, localized content, pricing and currency configuration, and order tracking with location awareness. You can update profile data, manage media assets, and monitor active sessions through a single interface.

## Live Demo

Visit the production deployment: [test-task](https://test-task-webapp.azurewebsites.net)

Test credentials:

```
email: test@gmail.com
pass: qwerty123
```

## Local Development

1. Ensure Node.js 20+ and npm are installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to access the app.

## Docker Development

The repository includes a `Dockerfile` and `docker-compose.yml` for local development. Install Docker Desktop: https://www.docker.com/get-started

1. Quick single-command rebuild and start:

```bash
npm run docker:rebuild
```

2. Open [http://localhost:4000](http://localhost:4000) to access the app from Docker.

## GitHub Actions Deployment

Deployment to Azure is configured via the GitHub Actions workflow at `.github/workflows/deploy.yml`.
Pushing to the `main` branch runs the workflow which builds the Docker image, pushes it to Azure Container Registry, updates the Web App container image, and restarts the application.
