FROM mcr.microsoft.com/playwright:bionic
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs
WORKDIR /application
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
RUN npm prune --production
ENV NODE_ENV production
ENTRYPOINT ["npm", "run", "start:node", "--"]
