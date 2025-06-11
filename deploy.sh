#!/bin/bash
# deploy.sh

set -e # Exit immediately if a command exits with a non-zero status.

ZOLA_PROJECT_DIR="/root/site"
WEB_ROOT_PUBLIC="/var/www/homepage/public"
WEB_USER="www-data"

echo "Building Zola site..."
# Ensure output directory exists before Zola tries to write to it, with appropriate parent permissions
# mkdir -p already done manually above, or ensure script has sudo
# If Zola is run by root (via sudo), it can create WEB_ROOT_PUBLIC if its parent /var/www/homepage exists and is writable by root.
cd "$ZOLA_PROJECT_DIR"
# Clear old files if necessary, be CAREFUL
# rm -rf "${WEB_ROOT_PUBLIC:?}"/* # The :? ensures variable is set, preventing accidental "rm -rf /*"
zola build --output-dir "$WEB_ROOT_PUBLIC" --force

echo "Setting ownership and permissions for Nginx..."
chown -R "$WEB_USER:$WEB_USER" "$WEB_ROOT_PUBLIC"
find "$WEB_ROOT_PUBLIC" -type d -exec chmod 755 {} \;
find "$WEB_ROOT_PUBLIC" -type f -exec chmod 644 {} \;

echo "Deployment complete."
echo "Remember to test your Nginx configuration and reload Nginx if changes were made to its config."
# Example: sudo nginx -t && sudo systemctl reload nginx
