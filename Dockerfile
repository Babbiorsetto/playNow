FROM node:22.12.0-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
USER node
RUN npm run build
CMD ["node", "./dist/index.js"]
