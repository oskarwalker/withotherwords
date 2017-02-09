FROM node:7.4.0

RUN npm install -g yarn

RUN mkdir -p /opt/wow/app
WORKDIR /opt/wow/app

COPY package.json yarn.lock /opt/wow/app/
RUN yarn install --pure-lockfile

RUN npm install pm2

ADD . /opt/wow/app

RUN yarn run build:all:production

EXPOSE 3000
CMD ["./node_modules/pm2/bin/pm2", "start", "processes.json", "--no-daemon"]