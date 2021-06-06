#!/bin/bash

# Install the letsencrypt directory on the EB/EC2 server.
# NOTE: that this directory will not retain necessary symlinks for certbot renew to function property.
# Therefore, to process renewal, simply generate new certificates without renew command.
aws s3 cp --recursive s3://elasticbeanstalk-us-east-2-720572162060/letsencrypt/ /etc/letsencrypt/
systemctl reload nginx
