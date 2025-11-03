FROM node:18
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source
COPY . .

# Expose backend port
EXPOSE 3013

# Run
CMD ["npm", "start"]