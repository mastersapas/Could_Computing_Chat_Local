FROM node:latest

WORKDIR /usr/app

COPY CloudAPI/package*.json .
RUN npm install

COPY CloudAPI/. .

ENTRYPOINT [ "node", "app.js" ]