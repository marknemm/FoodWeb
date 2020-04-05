FROM node:12.16.1-slim

WORKDIR /usr/src/foodweb/client

COPY ./client /usr/src/foodweb/client
COPY ./shared /usr/src/foodweb/shared
COPY ./tslint.json /usr/src/foodweb/tslint.json

EXPOSE 4200

# Ensure we can run npm install with root user permissions.
RUN npm set unsafe-perm true
