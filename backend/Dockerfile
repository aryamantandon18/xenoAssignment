# backend/Dockerfile

FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files from backend folder
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy all backend source code
COPY . .

# Default command (can be overridden by docker-compose)
CMD ["node", "server.js"]
