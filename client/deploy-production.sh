#!/bin/bash

# To create a SFTP user in Ionos, go to Hosting -> SFTP

# Repalce the local .env with production .env
cp env-files-production/.env .env

source .env
# Build
vite build
# Place the .env back
cp env-files-local/.env .env

# Upload to Ionos through lftp
lftp -u $IONOS_USER_PRODUCTION,$IONOS_PASS_PRODUCTION sftp://$IONOS_HOST_PRODUCTION <<EOF
set sftp:auto-confirm yes
set net:timeout 10
debug 3
mirror -R dist .
bye
EOF

rm -r dist

echo "Deployment complete"