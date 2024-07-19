# Base image
FROM --platform=linux/amd64 node:20-alpine3.20


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start:prod"]