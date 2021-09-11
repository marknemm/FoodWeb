#!/bin/bash

# Check if configured to skip this script.
if [ "$SKIP_INSTALL_CERTBOT" == "true" ] || [ "$SKIP_PREBUILD_HOOKS" == "true" ] || [ "$SKIP_HOOKS" == "true" ]; then
  exit 0
fi

# First 3 steps involve download, install, & enable EPEL; certbot needs it to run on Amazon Linux 2 EC2 servers.
# EPEL: Extra Packages for Enterprise Linux -- an open-source repository project that provides add-on software packages.
wget -r --no-parent -A 'epel-release-*.rpm' http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
yum-config-manager --enable epel*

# Finally, install certbot, which is used to generate, renew, & manage letsencrypt RSA certificates for HTTPS/SSL.
yum install -y certbot python2-certbot-nginx
