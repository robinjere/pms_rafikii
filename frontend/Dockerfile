# Build stage
FROM node:18.19.1-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install netcat for network checks
RUN apk add --no-cache netcat-openbsd

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add runtime environment variable support
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Add wait-for script to check backend availability
COPY wait-for-backend.sh /wait-for-backend.sh
RUN chmod +x /wait-for-backend.sh

# Copy env config
COPY .env.example /usr/share/nginx/html/.env

EXPOSE 80

# Wait for backend to be ready before starting nginx
CMD ["/bin/sh", "-c", "/wait-for-backend.sh backend:3001 -- nginx -g 'daemon off;'"]
