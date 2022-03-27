#!/bin/bash

# Check if configured to skip this script.
if [ "$SKIP_RENEW_CERTS_CRON" == "true" ] || [ "$SKIP_PREBUILD_HOOKS" == "true" ] || [ "$SKIP_HOOKS" == "true" ]; then
  echo "Skipping 01-renew-certs-cron.sh"
  exit 0
fi

# Create script for letsencrypt cert renewal, which will be executed via cron job below
cat > /usr/local/sbin/renew-certs.sh <<EOF
#!/bin/bash

# Prepare for brand-new letsencrypt cert installation via certbot.
rm -rf /etc/letsencrypt
if [ -f /etc/nginx/conf.d/web.conf ]; then
  mv /etc/nginx/conf.d/web.conf /etc/nginx
  mv /etc/nginx/conf.d/admin.conf /etc/nginx
fi

# Generate & install new letsencrypt certs via certbot.
certbot certonly -n -d $WWW_DOMAIN -d $ADMIN_DOMAIN -d $RAW_DOMAIN --nginx --agree-tos --email $MAIN_EMAIL

# Perform nginx reload so that new certs are used.
if [ -f /etc/nginx/web.conf ]; then
  mv /etc/nginx/web.conf /etc/nginx/conf.d
  mv /etc/nginx/admin.conf /etc/nginx/conf.d
  systemctl reload nginx
fi

# Sync new certs with S3 bucket storage.
aws s3 sync /etc/letsencrypt/ ${EB_S3_BUCKET_URI}/letsencrypt/
EOF

# Create cron job executing script above each Sunday at 12:00 AM.
chmod +x /usr/local/sbin/renew-certs.sh
crontab -r
echo "0 0 * * 0 /usr/local/sbin/renew-certs.sh" | crontab -

exit 0; # Do not fail build if any of the previous commands failed.
