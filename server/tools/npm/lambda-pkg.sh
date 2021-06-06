#!/usr/bin/env bash

npm install --production

mkdir -p ./lambda-layers/core-dependencies/nodejs/node_modules
mkdir -p ./lambda-layers/geo-tz-dependencies/nodejs/node_modules

rm -rf ./lambda-layers/geo-tz-dependencies/nodejs/node_modules/*
mv ./node_modules/geo-tz ./lambda-layers/geo-tz-dependencies/nodejs/node_modules/

rm -rf ./lambda-layers/core-dependencies/nodejs/node_modules/*
mv ./node_modules/* ./lambda-layers/core-dependencies/nodejs/node_modules/
