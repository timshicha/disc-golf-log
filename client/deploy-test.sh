#!/bin/bash

# To create a SFTP user in Ionos, go to Hosting -> SFTP

# Repalce the local .env with test .env
cp env-files-test/.env .env

source .env
# Build
vite build
# Place the .env back
cp env-files-local/.env .env

# Upload to Ionos through lftp
lftp -u $IONOS_USER_TEST,$IONOS_PASS_TEST sftp://$IONOS_HOST_TEST <<EOF
set sftp:auto-confirm yes
set net:timeout 10
debug 3
mirror -R dist .
bye
EOF

rm -r dist

echo "Deployment complete"