# client build
FROM node:14 AS client-build

WORKDIR /client

COPY client/package*.json ./

RUN npm install 

COPY client .

RUN npm run build

# server run
FROM node:14

WORKDIR /app

RUN npm install -g pm2@^4.4.0

COPY server/package*.json ./server/
COPY package*.json ./

RUN cd server && npm install

COPY server ./server
COPY --from=client-build /client/dist ./server/dist

CMD [ "npm", "run", "start-prod-docker-server" ]

EXPOSE 4000
