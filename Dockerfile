FROM node:20-alpine

WORKDIR /app

# deps d'abord (meilleur cache)
COPY package*.json ./
RUN npm ci --omit=dev

# code ensuite
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
