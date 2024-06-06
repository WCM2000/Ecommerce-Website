FROM node:20-alpine

WORKDIR /app/backend

# COPY ./backend/package*.json ./
COPY package*.json ./

RUN npm install

# COPY ./backend .
COPY . .

EXPOSE 3000

CMD ["npm", "start"]