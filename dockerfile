# FROM redis:latest
FROM node:19.4.0

ENV NODE_ENV=development

# working dir of app ? 
WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

# RUN apt update
# RUN apt install redis

COPY . .

RUN npm i

# RUN sudo service redis-server restart

# CMD [ "redis-server", "start" ]
EXPOSE 3000
RUN npm i

# command for node app ? 
# CMD [ "node", "server.js" ]
CMD [ "npx","nodemon", "start" ]
