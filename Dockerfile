
FROM node:14
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE 5013
CMD ["npm", "serve"]
