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

## Useful references

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)
