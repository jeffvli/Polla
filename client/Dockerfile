# pull official base image
FROM node:15.9.0-alpine3.13

# set working directory
WORKDIR /usr/src/app

# install app dependencies
COPY package*.json ./

RUN npm install

# add app
COPY . ./

# start app
EXPOSE 3000
CMD ["npm", "start"]
