# node_backend/Dockerfile

# 기존 Dockerfile 내용
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]

