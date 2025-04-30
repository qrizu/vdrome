# 1. Byggsteget
FROM node:20-alpine AS build

WORKDIR /app

# Kopiera och installera beroenden
COPY package.json package-lock.json ./
RUN npm install

# Kopiera resten av koden och bygg projektet
COPY . .
RUN npm run build

# 2. Serversteget
FROM nginx:stable-alpine

# Ta bort default-konfiguration och lägg till vår egen (valfritt)
RUN rm -rf /usr/share/nginx/html/*

# Kopiera byggda filer från förra steget
COPY --from=build /app/dist /usr/share/nginx/html

# Exponera port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]