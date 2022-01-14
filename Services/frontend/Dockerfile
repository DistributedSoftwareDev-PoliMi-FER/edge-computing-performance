FROM nginx:1.17.2-alpine as build

LABEL name="frontend" \
      description="This template allows you to start setting up a front-end project with the Angular framework" \
      eu.mia-platform.url="https://www.mia-platform.eu" \
      eu.mia-platform.version="0.1.0"

COPY nginx /etc/nginx

RUN touch ./off \
  && chmod o+rw ./off \
  && echo "frontend: $COMMIT_SHA" >> /etc/nginx/commit.sha

WORKDIR /usr/static

COPY ./dist/edge-conference .

USER nginx


