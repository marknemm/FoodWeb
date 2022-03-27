#!/bin/bash

# Check if configured to skip this script.
if [ "$SKIP_ENSURE_NGINX_CONF" == "true" ] || [ "$SKIP_POSTDEPLOY_HOOKS" == "true" ] || [ "$SKIP_HOOKS" == "true" ]; then
  echo "Skipping 01-ensure-nginx-conf.sh"
  exit 0
fi

# Ensure that the nginx/conf.d extension files are placed within the /etc/nginx/conf.d directory, and (re)load them.
/bin/cp -rf /var/app/current/.platform/nginx/conf.d/* /etc/nginx/conf.d
systemctl reload nginx

exit 0; # Do not fail build if any of the previous commands failed.
