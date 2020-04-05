FROM node:12.16.1

# Install python & build-essential for dependencies that require c-make build (e.g. bcrypt).
RUN apt-get update || : \
 && apt-get install python build-essential -y \
 # Next 3 lines used to install postgresql-client-11: https://wiki.postgresql.org/wiki/Apt
 && apt install postgresql-common -y \
 && yes | sh /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh \
 && apt-get install postgresql-client-11 -y

COPY ./server /usr/src/foodweb/server
COPY ./shared /usr/src/foodweb/shared
COPY ./tslint.json /usr/src/foodweb/tslint.json

WORKDIR /usr/src/foodweb/server
EXPOSE 5000

# Ensure we can run npm install with root user permissions.
RUN npm set unsafe-perm true
