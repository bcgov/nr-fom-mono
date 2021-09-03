#!/bin/sh
# Copied from https://github.com/postgis/docker-postgis/blob/master/13-3.1/initdb-postgis.sh
set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Load extensions into $POSTGRES_DB
for DB in "$POSTGRES_DB"; do
	echo "Loading FOM extensions into $DB"
	"${psql[@]}" --dbname="$DB" <<-'EOSQL'
		create extension if not exists plpgsql; 
		create extension if not exists pgcrypto;
EOSQL
done
