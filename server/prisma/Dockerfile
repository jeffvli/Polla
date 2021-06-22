FROM node:15.9.0-alpine3.13

RUN mkdir /app
WORKDIR /app

COPY ./ ./prisma/

CMD ["npx", "prisma", "studio"]
