FROM node:14.21.3

COPY package.json /app/

WORKDIR /app

RUN npm i

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

COPY ./ /app/

CMD ["npm","start"]
