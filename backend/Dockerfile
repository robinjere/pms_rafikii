FROM node:18.19.1-alpine

# Install required dependencies for bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create directory for logs
RUN mkdir -p /app/logs

# Add wait-for-it script to wait for database
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

EXPOSE 3001

# Use shell form to allow variable substitution
CMD ["/bin/sh", "-c", "/wait-for-db.sh mysql:3306 -- npm start"]
