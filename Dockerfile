# Use Node.js 24 slim latest as base image (React 19 requires Node 18+)
FROM node:24.11.0-slim

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
# RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]