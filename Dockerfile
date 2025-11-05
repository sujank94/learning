FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install only production dependencies; for development remove --only=production or use a multi-stage build
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]
