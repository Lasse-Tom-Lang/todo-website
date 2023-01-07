FROM node:latest

WORKDIR /

COPY ./* ./

RUN npm install

WORKDIR /public

COPY ./public/* ./

WORKDIR /public/icons

COPY ./public/icons/* ./

WORKDIR /

EXPOSE 80

RUN npx prisma generate