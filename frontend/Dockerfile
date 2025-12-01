FROM node:20-slim  AS build 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod -R 755 /app/node_modules/.bin
RUN npm run build 
# stage:2
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off ;"]
