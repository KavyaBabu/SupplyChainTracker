FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    rm -rf package-lock.json node_modules && \
    npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
