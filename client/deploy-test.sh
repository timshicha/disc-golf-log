#!/bin/bash

# To create a SFTP user in Ionos, go to Hosting -> SFTP
IONOS_USER="a0000000"
IONOS_PASS="password"
IONOS_HOST="access-0000000000.webspace-host.com"

# Repalce the local .env with test .env
mv .env env-files-local/.env
mv env-files-test/.env .env
# Build
vite build
# Place the .env back
mv .env env-files-test/.env
mv env-files-local/.env .env

# Upload to Ionos through lftp
lftp -u $IONOS_USER,$IONOS_PASS sftp://$IONOS_HOST <<EOF
set sftp:auto-confirm yes
set net:timeout 10
debug 3
mirror -R dist .
bye
EOF

rm -r dist

echo "Deployment complete"