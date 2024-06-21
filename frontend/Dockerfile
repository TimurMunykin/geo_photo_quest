# Use official Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose port
EXPOSE 5000

# Start the app
# CMD ["PORT=5000", "serve", "-s", "build"]
CMD npm start