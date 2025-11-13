This project runs on [Next.js](https://nextjs.org) with Prisma and PostgreSQL.

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Local Development](#local-development)
- [Docker Development](#docker-development)
- [Azure Deployment (App Code Updates)](#azure-deployment-app-code-updates)
- [Azure Deployment (Prisma Schema Changes)](#azure-deployment-prisma-schema-changes)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Useful References](#useful-references)

## Overview

`test-task` is an operations dashboard for managing the lifecycle of products and orders. The app supports product catalog maintenance, localized content, pricing and currency configuration, and order tracking with location awareness. Administrators can update profile data, manage media assets, and monitor active sessions through a single interface.

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
3. Configure environment variables in `.env.local` (see Azure Environment variables for required keys).
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to access the app.

## Docker Development

The repository provides a `Dockerfile` and `docker-compose.yml` for a containerized environment with PostgreSQL.

1. Duplicate `.env.docker` to configure secrets before running the stack.
2. Build the containers:
   ```bash
   docker compose build
   ```
3. Start the services in the background:
   ```bash
   docker compose up -d
   ```
4. Apply database migrations (first run and after schema changes):
   ```bash
   docker compose exec web npx prisma migrate deploy
   ```
5. Tail logs if needed:
   ```bash
   docker compose logs -f web
   ```
6. Access the app at [http://localhost:4000](http://localhost:4000).
7. Stop the stack when finished:
   ```bash
   docker compose down
   ```

## Azure Deployment (App Code Updates)

Use these steps when application code changes and the database schema remains unchanged. Make sure you are authenticated with Azure CLI (`az login`).

1. Log in to Azure Container Registry (optional when using the shortcut command):
   ```bash
   npm run azure:acr:login
   ```
2. Build the container image locally:
   ```bash
   npm run azure:docker:build
   ```
3. Push the latest image to Azure Container Registry:
   ```bash
   npm run azure:docker:push
   ```
4. Point the Azure Web App at the new image:
   ```bash
   npm run azure:webapp:update
   ```
5. Restart the Web App container to apply configuration changes:
   ```bash
   npm run azure:webapp:restart
   ```
6. Alternatively, run the full pipeline in one command:
   ```bash
   npm run deploy:azure
   ```

## Azure Deployment (Prisma Schema Changes)

Follow these additional steps when `prisma/schema.prisma` changes.

1. Create and review a new migration locally:
   ```bash
   npm run prisma:migrate:name <migration-name>
   ```
2. Verify the migration and generated Prisma client:
   ```bash
   npx prisma generate
   ```
3. Ensure the `prisma/migrations` directory and updated `schema.prisma` are committed.
4. Deploy application code by following the [Azure Deployment (App Code Updates)](#azure-deployment-app-code-updates) steps.
5. Execute pending migrations against the Azure database from the running container. One option is to open an SSH session to the Web App and run:
   ```bash
   npx prisma migrate deploy
   ```
   Alternatively, run the command via a CI/CD job or custom startup script.
6. Confirm the application is healthy and that schema changes propagated as expected.

## GitHub Actions Deployment

Changes pushed to `main` trigger `.github/workflows/deploy.yml` to build and publish the Docker image, update the Web App container, and restart the instance. Configure these repository secrets before enabling the workflow:

- `AZURE_CREDENTIALS` — JSON from `az ad sp create-for-rbac --sdk-auth ...`
- `AZURE_CONTAINER_REGISTRY` — login server, for example `testtaskregistry.azurecr.io`
- `AZURE_REGISTRY_NAME` — registry name, for example `testtaskregistry`
- `AZURE_WEBAPP_NAME` — target Web App name, for example `test-task-webapp`
- `AZURE_RESOURCE_GROUP` — resource group containing the Web App

Environment variables such as `POSTGRES_PRISMA_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and ImageKit credentials must be configured in the Azure App Service **Environment variables** blade for `test-task-webapp`.

## Useful References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)
