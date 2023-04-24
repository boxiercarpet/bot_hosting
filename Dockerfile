FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/web

RUN npm install

RUN npm run build

WORKDIR /app

EXPOSE 8080
EXPOSE 21

CMD ["node", "."]   