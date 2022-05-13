# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:13-master

# Description
LABEL org.opencontainers.image.description "FOM database"

# Copy over app
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Expose port - mostly a convention, for readability
EXPOSE 5432

# Start up command
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "postgres"]
