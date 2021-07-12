<!--
 Copyright (c) 2021 jli

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->


# Polla

Polla is an online polling aiming to be a simple self-hosted alternative to strawpoll.com.



## Features

- Set polls as open or closed
- Set polls as public or private
- IP Address or Browser session vote duplication detection
- Allow anonymous or authenticated poll creation and responses
- User profiles



## Demo

<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/create_poll.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/create_poll.png" width="33%"/></a>
<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_responder.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_responder.png" width="33%" /></a>
<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_results.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_results.png" width="33%" /></a>
<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_responder_voted.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/poll_responder_voted.png" width="33%" /></a>
<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/discover.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/discover.png" width="33%" /></a>
<a href="https://raw.githubusercontent.com/jeffvli/Polla/main/media/profile.png"><img src="https://raw.githubusercontent.com/jeffvli/Polla/main/media/profile_compressed.png" width="33%" /></a>
## Run Locally

You will need to set up Redis and PostgreSQL. For ease of deployment, I recommend using Docker to deploy.

Clone the project

```bash
  git clone https://github.com/jeffvli/Polla.git
```

### Client

Go to the project directory. Add `.env` files as necessary from the [environment variables](#environment-variables).

```bash
  cd ./Polla/client
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```

### Server

Go to the project directory

```bash
  cd ./Polla/server
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

### Docker

You can run this project with Docker Compose.

Go to the root project directory

```bash
cd ./Polla
```

Build the images

```bash
docker compose --env-file ./.env build
```

Start the project

```bash
docker compose --env-file ./.env up
```
## Deployment

### Docker

Go to the root project directory

```bash
cd ./Polla
```

Build the images

```bash
docker compose --env-file ./.env.prod --file ./docker-compose-prod.yml build
```

Start the project

```bash
docker compose --env-file ./.env.prod --file ./docker-compose-prod.yml up
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Client

`REACT_APP_BASE_URL` `http://localhost:3000`

`REACT_APP_API_BASE_URL` `http://localhost:5000`

`REACT_APP_GITHUB_URL` `https://github.com/jeffvli/Polla` -- deprecated

### Server

`DATABASE_URL` `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@http://localhost:5432/${POSTGRES_DB}?schema=public`

`APP_BASE_URL` `http://localhost:3000`

`JWT_SECRET` `InsertSecret!`

`JWT_SECRET_EXPIRATION` `5m`

`JWT_REFRESH_SECRET` `InsertSecret!`

`JWT_REFRESH_SECRET_EXPIRATION` `30d`

`REDIS_HOST` `http://localhost`

`REDIS_PORT` `6379`

### Docker

If using docker, reference the [env-example](./env-example) file to create your `.env` file
