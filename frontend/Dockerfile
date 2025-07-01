# Step 1: Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the production React app
RUN npm run build

# Step 2: Serve the build with Nginx
FROM nginx:alpine

# Copy production build from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port and run Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
