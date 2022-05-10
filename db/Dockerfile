# RedHat UBI 8 with nodejs 14
FROM postgis/postgis:13-master

# Vars - configured for local development
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=test
ENV POSTGRES_DB=fom
ENV POSTGRES_HOST_AUTH_METHOD=trust
ENV POSTGRES_PORT=5342

# Copy over app
RUN sed -i '/EXISTS postgis_tiger_geocoder;*/a CREATE EXTENSION IF NOT EXISTS pgcrypto;' \
        /docker-entrypoint-initdb.d/10_postgis.sh

# Expose port - mostly a convention, for readability
EXPOSE 5432

# Start up command
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "postgres"]
