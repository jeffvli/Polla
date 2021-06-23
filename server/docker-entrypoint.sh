#!/bin/sh
npx prisma migrate dev --name "migrate"

npm run dev
