FROM node:12-alpine3.14

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

USER node

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "app.js" ]
