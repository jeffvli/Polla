# Create image based on the official Node 6 image from the dockerhub
FROM node:15.9.0-alpine3.13

ADD docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./
COPY prisma ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . ./
# Expose the port the app runs in
EXPOSE 5000
# Serve the app
ENTRYPOINT ["/docker-entrypoint.sh"]
