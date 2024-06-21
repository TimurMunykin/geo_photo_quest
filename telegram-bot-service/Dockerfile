FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Install development dependencies
RUN npm install --only=dev

# Default command
CMD ["npm", "run", "dev"]
