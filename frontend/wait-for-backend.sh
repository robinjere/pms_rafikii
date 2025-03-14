#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 $(echo $host | cut -d: -f1) $(echo $host | cut -d: -f2); do
  echo "Waiting for backend service to be ready... Trying again in 5 seconds"
  sleep 5
done

>&2 echo "Backend is up - executing command"
exec $cmd
