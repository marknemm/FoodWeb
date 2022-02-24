#!/usr/bin/env bash

npm install --production

mkdir -p ./lambda-layers/core-dependencies/nodejs/node_modules
mkdir -p ./lambda-layers/geo-tz-dependencies/nodejs/node_modules
mkdir -p ./lambda-layers/core-web-server/~web
mkdir -p ./lambda-layers/shared/~shared

rm -rf ./lambda-layers/geo-tz-dependencies/nodejs/node_modules/*
mv ./node_modules/geo-tz ./lambda-layers/geo-tz-dependencies/nodejs/node_modules/

rm -rf ./lambda-layers/core-dependencies/nodejs/node_modules/*
mv ./node_modules/* ./lambda-layers/core-dependencies/nodejs/node_modules/

npm install
npm run build web

rm -rf ./lambda-layers/core-web-server/~web/*
rm -rf ./lambda-layers/core-web-server/templates
cp -r ./dist/server/projects/web/src/* ./lambda-layers/core-web-server/~web
cp -r ./dist/server/templates ./lambda-layers/core-web-server/templates

rm -rf ./lambda-layers/shared/~shared/*
cp -r ./dist/shared/src/web/* ./lambda-layers/shared/~shared
