FROM node:latest

# Install python & build-essential for dependencies that require c-make build (e.g. bcrypt).
RUN apt-get update || : \
 && apt-get install python build-essential -y \
 # Next 3 lines used to install postgresql-client-11: https://wiki.postgresql.org/wiki/Apt
 && apt install postgresql-common -y \
 && yes | sh /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh \
 && apt-get install postgresql-client-11 -y

COPY . /usr/src/foodweb
WORKDIR /usr/src/foodweb

EXPOSE 5000
EXPOSE 5001
EXPOSE 4200
EXPOSE 4201
