FROM node:lts-alpine
LABEL authors="梦清"

WORKDIR /app
#todo:下版本会改由dockerfile进行构建而不是github actions
COPY ./node_modules ./node_modules
COPY ./dist ./dist
COPY ./docs/.vuepress/dist ./docs/.vuepress/dist

EXPOSE 1028
ENTRYPOINT ["node", "dist/app.js"]