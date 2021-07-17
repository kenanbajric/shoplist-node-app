FROM node:14

WORKDIR /dist

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "./dist/app.js" ]