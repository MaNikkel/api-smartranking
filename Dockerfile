
FROM node:alpine

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install

EXPOSE 3000