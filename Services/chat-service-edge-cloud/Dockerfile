FROM node:14-alpine3.10 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:14-alpine3.10 as ts-remover

ARG COMMIT_SHA=<not-specified>
ENV NODE_ENV=production

WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/build ./
RUN npm install --only=production

RUN echo "chat-service: $COMMIT_SHA" >> ./commit.sha

########################################################################################################################

FROM node:14-alpine3.10 as production

LABEL maintainer="undefined" \
      name="chat-service" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.1.0"

ENV HTTP_PORT=3000
ENV NODE_ENV=production

WORKDIR /home/node/app
COPY --from=ts-remover /usr/app ./

CMD ["npm", "start"]
