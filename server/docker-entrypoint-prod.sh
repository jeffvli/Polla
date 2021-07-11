#!/bin/sh

apk add --no-cache bash
./wait-for-it.sh db:$1 --timeout=20 --strict -- echo "db is up"

npx prisma migrate deploy

yarn prod
