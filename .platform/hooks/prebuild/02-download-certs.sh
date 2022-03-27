#!/bin/bash

# Check if configured to skip this script.
if [ "$SKIP_DOWNLOAD_CERTS" == "true" ] || [ "$SKIP_PREBUILD_HOOKS" == "true" ] || [ "$SKIP_HOOKS" == "true" ]; then
  echo "Skipping 02-download-certs.sh"
  exit 0
fi

# Install the letsencrypt directory on the EB/EC2 server.
# NOTE: that this directory will not retain necessary symlinks for certbot renew to function property.
# Therefore, to process renewal, simply generate new certificates without renew command.
aws s3 cp --recursive ${EB_S3_BUCKET_URI}/letsencrypt/ /etc/letsencrypt/

# If no letsencrypt data was found in S3 storage bucket, then newly generate it.
if [ ! -f "/etc/letsencrypt/live/${WWW_DOMAIN}/privkey.pem" ]; then
  /usr/local/sbin/renew-certs.sh
fi
