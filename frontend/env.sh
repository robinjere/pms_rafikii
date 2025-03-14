#!/bin/sh

# Replace environment variables in the nginx html directory
echo "Replacing environment variables..."
for file in /usr/share/nginx/html/static/js/main.*.js;
do
  if [ -f $file ]; then
    echo "Processing $file..."
    sed -i 's|REACT_APP_BACKEND_API_BASE_URL_PLACEHOLDER|'${REACT_APP_BACKEND_API_BASE_URL}'|g' $file
    sed -i 's|REACT_APP_SYSTEM_TITLE_PLACEHOLDER|'${REACT_APP_SYSTEM_TITLE}'|g' $file
  fi
done

echo "Starting Nginx..."
exec "$@"
