FROM node:20-alpine

WORKDIR /app

# deps d'abord (meilleur cache)
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# code ensuite
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
