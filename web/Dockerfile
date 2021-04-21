FROM node:15.8.0

RUN npm install --global serve

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm install

ARG VERSION
ARG GA_ID
ENV SHA_VERSION=$VERSION
ENV GA_ID=$GA_ID

ADD . .
RUN npm run build && rm -rf node_modules

CMD ./set_config.sh > build/config.js && serve ./build
