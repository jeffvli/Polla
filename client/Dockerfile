# pull official base image
FROM node:15.9.0-alpine3.13

# set working directory
WORKDIR /app

# install app dependencies
COPY package*.json ./

ARG REACT_APP_BASE_URL
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_GITHUB_URL

ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_GITHUB_URL=$REACT_APP_GITHUB_URL

RUN npm install

# add app
COPY . ./

# start app
EXPOSE 3000
CMD ["npm", "start"]
