# Use the specified Playwright base image
FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npx playwright install

# Copy the rest of your app's source code
COPY . .

ENV PORT=8080
EXPOSE 8080

# Command to run your app
CMD ["node", "index.js"]
