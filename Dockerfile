# Use Node.js 24 slim latest as base image (React 19 requires Node 18+)
FROM node:24.11.0-slim

# Set working directory
WORKDIR /app

# Install dependencies for building native modules and Cypress
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

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