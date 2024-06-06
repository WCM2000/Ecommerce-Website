FROM node:20-alpine

WORKDIR /app/frontend

# COPY ./frontend/package*.json ./
COPY package*.json ./

RUN npm install

# COPY ./frontend .
COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]