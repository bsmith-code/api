FROM node:12-alpine

WORKDIR /api-gateway

COPY . .

RUN npm install && npm cache clean --force

RUN ["chmod", "+x", "./docker/start_node.sh"]

CMD ["./docker/start_node.sh"]
