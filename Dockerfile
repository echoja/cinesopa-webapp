# cinesopa build
FROM node:14 AS cinesopa-build

WORKDIR /cinesopa

COPY cinesopa/package*.json ./

RUN npm install 

COPY cinesopa .

RUN npm run build


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

# puppeteer execution environment
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


# Global npm package install
RUN npm install -g pm2@^4.4.0

# server npm install by production
COPY server/package*.json ./server/
COPY package*.json ./
RUN cd server && npm install --production

# copy source code and client dists
COPY server/pdf-output ./server/pdf-output
# COPY server/config ./server/config
COPY server/src ./server/src
RUN mkdir server/uploads && mkdir server/temp
COPY --from=sopaseom-build /sopaseom/dist ./server/dist/sopaseom
COPY --from=cinesopa-build /cinesopa/dist ./server/dist/cinesopa

CMD [ "npm", "run", "start-prod-docker-server" ]

EXPOSE 4000
