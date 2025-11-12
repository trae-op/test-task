This project runs on [Next.js](https://nextjs.org) with Prisma and PostgreSQL.

## Local development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the app during development.

## Docker workflow

The repository provides a `Dockerfile` and `docker-compose.yml` for a containerized environment with PostgreSQL.

1. Build images: `docker compose build`
2. Start services: `docker compose up -d`
3. Apply migrations (first run): `docker compose exec web npx prisma migrate deploy`
4. Tail logs: `docker compose logs -f web`
5. Stop stack: `docker compose down`

The compose stack reads environment variables from `.env.docker`. Adjust secrets or third-party keys there before running the containers.

When running via Docker, the web app is available at [http://localhost:4000](http://localhost:4000).

## Azure container deployment

Ensure you are authenticated with `az login` before deploying.

```bash
# Rebuild image locally
npm run azure:docker:build

# Push the latest image to Azure Container Registry
npm run azure:docker:push

# Point the web app at the new image
npm run azure:webapp:update

# Restart the container to pick up any configuration changes
npm run azure:webapp:restart

# Full pipeline shortcut
npm run deploy:azure
```

## GitHub Actions deployment

Changes pushed to `main` trigger `.github/workflows/deploy.yml` to build and publish the Docker image, update the Web App container, and restart the instance. Configure these repository secrets before enabling the workflow:

- `AZURE_CREDENTIALS` — JSON from `az ad sp create-for-rbac --sdk-auth ...`
- `AZURE_CONTAINER_REGISTRY` — login server, for example `testtaskregistry.azurecr.io`
- `AZURE_REGISTRY_NAME` — registry name, for example `testtaskregistry`
- `AZURE_WEBAPP_NAME` — target Web App name, for example `test-task-webapp`
- `AZURE_RESOURCE_GROUP` — resource group containing the Web App

Environment variables such as `POSTGRES_PRISMA_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and ImageKit credentials must be configured in the Azure App Service **Environment variables** blade for `test-task-webapp`.

## Useful references

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)
