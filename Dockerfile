FROM node:lts-alpine
LABEL authors="梦清"

WORKDIR /app
COPY dist .

EXPOSE 1028
CMD ["node", "app.js"]