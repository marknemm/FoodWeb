#!/bin/bash

# Ensure that the nginx/conf.d extension files are placed within the /etc/nginx/conf.d directory.
/bin/cp -rf /var/app/current/.platform/nginx/conf.d/* /etc/nginx/conf.d
systemctl reload nginx
