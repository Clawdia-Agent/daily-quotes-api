FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production 2>/dev/null || true
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
