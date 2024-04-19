FROM node:21
# Set working directory
WORKDIR /src
# Copy package.json and package-lock.json
COPY package*.json ./

COPY . .

RUN npm install
# # Run database migrations and seeding
# RUN npm run migrate && npm run seed
# Expose port 3000
EXPOSE 3000
# Command to run the server
CMD ["npm", "run", "dev"]
