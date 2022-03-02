#!/bin/bash

cp ${GITHUB_WORKSPACE}/.ebextensions/options.config ${GITHUB_WORKSPACE}/serverless-env.yml

# Ensure ${ENV} is repalced with proper value.
sed -i "s/\${ENV}/$CONFIGURATION/g" ${GITHUB_WORKSPACE}/serverless-env.yml

# Delete first 2 lines of serverless-env.yml.
sed -i '1,2d' ${GITHUB_WORKSPACE}/serverless-env.yml

sed -i -e "s/^ \{1,\}\(.*\){{resolve:ssm:\(.*\):[0-9]\{1,\}}}/\1\2/g" ${GITHUB_WORKSPACE}/serverless-env.yml
