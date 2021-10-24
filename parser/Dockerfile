# Dockerfile
FROM node:alpine3.12

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /app/
RUN npm install 

EXPOSE 2222

CMD [ "npm", "start" ]