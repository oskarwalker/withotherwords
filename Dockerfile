FROM node:7.4.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /opt/wow/app
WORKDIR /opt/wow/app

COPY package.json yarn.lock /opt/wow/app/
RUN $HOME/.yarn/bin/yarn install --pure-lockfile

RUN npm install pm2

ADD . /opt/wow/app

RUN $HOME/.yarn/bin/yarn run js:build:production

EXPOSE 3000
CMD ["./node_modules/pm2/bin/pm2", "start", "processes.json", "--no-daemon"]