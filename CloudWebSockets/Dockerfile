FROM node:latest

WORKDIR /usr/app

COPY CloudWebSockets/package*.json .
RUN npm install

COPY CloudWebSockets/. .

ENTRYPOINT [ "node", "index.js" ]