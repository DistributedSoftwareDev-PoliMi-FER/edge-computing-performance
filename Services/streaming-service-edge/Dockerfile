FROM node:16.13.1-alpine3.12 as build

ARG COMMIT_SHA=<not-specified>
ENV NODE_ENV=production

WORKDIR /build-dir

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN echo "streaming-service-edge: $COMMIT_SHA" >> ./commit.sha

########################################################################################################################

FROM node:16.13.1-alpine3.12

LABEL maintainer="undefined" \
	name="streaming-service-edge" \
	description="This is the best template to start creating a service in node integrated inside the platform" \
	eu.mia-platform.url="https://www.mia-platform.eu" \
	eu.mia-platform.version="0.1.0"

ENV NODE_ENV=production
ENV LOG_LEVEL=info


WORKDIR /home/node/app

RUN mkdir media

RUN apk update && \
	apk upgrade && \
	apk add ffmpeg

COPY --from=build /build-dir ./

USER root

CMD ["npm", "-s", "start"]
