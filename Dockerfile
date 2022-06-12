
FROM node:14.16.0-buster

RUN mkdir web_app
WORKDIR /web_app

COPY package.json package-lock.json /web_app/
ENV NODE_ENV=production
RUN npm install

COPY . /web_app/

RUN npm run build

CMD ["node", "server.js"]
