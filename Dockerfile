FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/
EXPOSE 7004
CMD npx egg-scripts start --title=egg-server-code-robot-cli-server