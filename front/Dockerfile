FROM node:alpine3.14
RUN npm install pm2 -g
WORKDIR /app
COPY . /app/
EXPOSE 8080
CMD ["pm2-runtime", "app.js"]