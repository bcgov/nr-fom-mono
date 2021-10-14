# Adapted from https://github.com/BCDevOps/platform-services/tree/master/apps/pgsql/patroni/docker
# and https://github.com/postgis/docker-postgis/blob/master/13-3.1/Dockerfile

# Note that this base image below is NOT using an invariant tag - it does receive updates, 
# We protect stability by only using this to build the fom-db-ha image as part of our entire pipeline.
#FROM artifacts.developer.gov.bc.ca/docker-remote/postgres:13.4
FROM artifacts.developer.gov.bc.ca/docker-remote/postgis/postgis:13-3.1

ENV PATRONI_VERSION=2.1.1
# ENV POSTGIS_MAJOR=3
# If build fails, might be due to new version - check output of apt-cache showpkg postgres-13-postgis-3 below for new version
# ENV POSTGIS_VERSION=3.1.4+dfsg-1.pgdg110+1
# ENV LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
# ENV PATRONI_HOME=/opt/patroni

ARG PGHOME=/home/postgres

RUN export DEBIAN_FRONTEND=noninteractive \
    && set -x \
    && echo 'APT::Install-Recommends "0";\nAPT::Install-Suggests "0";' > /etc/apt/apt.conf.d/01norecommend \
    && apt-get update -y \
    # Fix for production database issue: No module named 'six' - added python3-six
    && apt-get install -y curl jq locales git build-essential python3 python3-dev python3-pip python3-wheel python3-setuptools python3-virtualenv python3-six libpq-dev \
    && echo 'Make sure we have a en_US.UTF-8 locale available' \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 \
    && pip3 --isolated --no-cache-dir install psycopg2-binary \
    && pip3 --isolated --no-cache-dir install "patroni[kubernetes]==${PATRONI_VERSION}" \
    # Fix for production database issue: No module named 'six' (also added above as python3-six)
    # && pip3 --isolated --no-cache-dir install six \
    # && apt-get install -y --no-install-recommends \
    #     postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
    #     postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts \
    && PGHOME=/home/postgres \
    && mkdir -p $PGHOME \
    && sed -i "s|/var/lib/postgresql.*|$PGHOME:/bin/bash|" /etc/passwd \
    && echo 'Setting permissions for OpenShift' \
    && chmod 664 /etc/passwd \
    && mkdir -p $PGHOME/pgdata/pgroot \
    && chgrp -R 0 $PGHOME \
    && chown -R postgres $PGHOME \
    && chmod -R 775 $PGHOME \
    && echo 'Cleaning up' \
    && apt-get remove -y git build-essential python3-dev python3-pip python3-wheel python3-setuptools \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* /root/.cache

COPY docker/db/contrib/root /
# Fix issue PermissionError: [Errno 13] Permission denied: '/usr/share/scripts/patroni/post_init.sh'
RUN chmod +x /usr/share/scripts/patroni/*.sh

# Cannot use docker-entrypoint-initdb.d from base postgres/postgis image as patroni overrides this - see post_init.sh
#RUN mkdir -p /docker-entrypoint-initdb.d

VOLUME /home/postgres/pgdata
EXPOSE 5432 8008
USER postgres
WORKDIR /home/postgres
CMD ["/bin/bash", "/usr/bin/entrypoint.sh"]
