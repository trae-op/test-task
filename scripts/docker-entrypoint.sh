#!/bin/sh
set -e

export PORT=${PORT:-4000}
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=${PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING:-1}
export PRISMA_CLI_QUERY_ENGINE_TYPE=${PRISMA_CLI_QUERY_ENGINE_TYPE:-binary}
export PRISMA_CLIENT_ENGINE_TYPE=${PRISMA_CLIENT_ENGINE_TYPE:-binary}

if [ -d "./prisma/migrations" ] && [ "$(ls -A ./prisma/migrations)" ]; then
	npx prisma migrate deploy --schema ./prisma/schema.prisma
else
	npx prisma db push --skip-generate --schema ./prisma/schema.prisma
fi

exec npm run start
