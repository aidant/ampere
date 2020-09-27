FROM node:14-alpine
WORKDIR /application
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
RUN npm prune --production
ENV NODE_ENV production
ENTRYPOINT ["npm", "run", "start:node", "--"]
