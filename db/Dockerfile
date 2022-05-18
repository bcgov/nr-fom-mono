# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:13-master

# Description
LABEL org.opencontainers.image.description "FOM database"

# Enable pgcrypto extension on startup
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Expose port - mostly a convention, for readability
EXPOSE 5432

# Permissions
ENV PGDATA=/var/lib/postgresql/data
RUN mkdir -p ${PGDATA} && \
    chown postgres:0 -R ${PGDATA} /var/run/postgresql
USER postgres
