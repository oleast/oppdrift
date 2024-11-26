# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

RUN npm ci --only=production

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]