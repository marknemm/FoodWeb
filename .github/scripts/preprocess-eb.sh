#!/bin/bash

# Copy hooks scripts to confighooks so that they re-run on config changes.
mkdir ${GITHUB_WORKSPACE}/.platform/confighooks && cp -r ${GITHUB_WORKSPACE}/.platform/hooks/* ${GITHUB_WORKSPACE}/.platform/confighooks

# Resolve environment variables within .ebextensions files.
find ${GITHUB_WORKSPACE}/.ebextensions -type f -exec sed -i -e "s/\${ENV}/$CONFIGURATION/g" {} \;

# Resolve environment variables within nginx conf files.
find ${GITHUB_WORKSPACE}/.platform/nginx/conf.d -type f -exec sed -i -e "s/\${ADMIN_DOMAIN}/$ADMIN_DOMAIN/g" {} \;
find ${GITHUB_WORKSPACE}/.platform/nginx/conf.d -type f -exec sed -i -e "s/\${RAW_DOMAIN}/$RAW_DOMAIN/g" {} \;
find ${GITHUB_WORKSPACE}/.platform/nginx/conf.d -type f -exec sed -i -e "s/\${WWW_DOMAIN}/$WWW_DOMAIN/g" {} \;
find ${GITHUB_WORKSPACE}/.platform/nginx/conf.d -type f -exec sed -i -e "s/\${MAIN_EMAIL}/$MAIN_EMAIL/g" {} \;
