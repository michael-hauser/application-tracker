
FROM node:14
WORKDIR /app
COPY package*.json ./
COPY ./server/package*.json ./server/ 
RUN npm install --prefix ./server
COPY ./client/package*.json ./client/
RUN npm install --prefix ./client
COPY . .
RUN npm run build
EXPOSE 5013
CMD ["npm", "serve"]
