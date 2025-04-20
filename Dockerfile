FROM node:lts-alpine
LABEL authors="梦清"

WORKDIR /app
COPY ["./node_modules", "./dist", "./"]
COPY ./docs/.vuepress/dist ./docs/.vuepress/dist

EXPOSE 1028
CMD ["node", "dist/app.js"]