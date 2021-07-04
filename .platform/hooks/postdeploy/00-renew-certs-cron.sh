#!/bin/bash

# Create script for letsencrypt cert renewal, which will be executed via cron job below
cat > /usr/local/sbin/renew-certs.sh <<EOF
#!/bin/bash

# Prepare for brand-new letsencrypt cert installation via certbot.
rm -rf /etc/letsencrypt
mv /etc/nginx/conf.d/web.conf /etc/nginx/
mv /etc/nginx/conf.d/admin.conf /etc/nginx

# Generate & install new letsencrypt certs via certbot.
certbot certonly -n -d www.wnyfoodweb.com -d admin.wnyfoodweb.com -d foodweb-env.eba-swceimpj.us-east-2.elasticbeanstalk.com --nginx --agree-tos --email foodweb.main@gmail.com

# Perform nginx reload so that new certs are used.
mv /etc/nginx/web.conf /etc/nginx/conf.d
mv /etc/nginx/admin.conf /etc/nginx/conf.d
systemctl reload nginx

# Sync new certs with S3 bucket storage.
aws s3 sync /etc/letsencrypt/ s3://elasticbeanstalk-us-east-2-720572162060/letsencrypt/
EOF

# Create cron job executing script above each Sunday at 12:00 AM.
chmod +x /usr/local/sbin/renew-certs.sh
crontab -r
echo "0 0 * * 0 /usr/local/sbin/renew-certs.sh" | crontab -
