#!/bin/bash
# Install certbot in order to auto renew letsencrypt RSA certificate for HTTPS/SSL, which is initially downloaded from S3 bucket.

# First 3 steps involve download, install, & enable EPEL; certbot needs it to run on Amazon Linux 2 EC2 servers.
# EPEL: Extra Packages for Enterprise Linux -- an open-source repository project that provides add-on software packages.
wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
yum-config-manager --enable epel*

# Finally, install certbot.
yum install -y certbot python2-certbot-nginx
