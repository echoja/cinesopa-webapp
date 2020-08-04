# sopaseom build
FROM node:14 AS sopaseom-build

WORKDIR /sopaseom

COPY sopaseom/package*.json ./

RUN npm install 

COPY sopaseom .

RUN npm run build

# server run
FROM node:14

WORKDIR /app

RUN npm install -g pm2@^4.4.0

COPY server/package*.json ./server/
COPY package*.json ./

RUN cd server && npm install --production

COPY server ./server
COPY --from=sopaseom-build /sopaseom/dist ./server/dist/sopaseom

CMD [ "npm", "run", "start-prod-docker-server" ]

EXPOSE 4000
