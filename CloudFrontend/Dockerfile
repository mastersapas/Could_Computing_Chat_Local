FROM node:latest

RUN npm install -g spa-http-server

WORKDIR /usr/app

COPY CloudFrontend/package*.json .
RUN npm install

COPY CloudFrontend/. .

RUN npm run build

CMD ["http-server", "dist", "-p", "3000", "--push-state"]

# ENTRYPOINT [ "npm", "run", "dev" ]