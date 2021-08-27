docker run -d --name patroni -u 1001 --read-only -p 8008:8008 -p 6432:5432 -e PATRONI_POSTGRESQL_DATA_DIR=/home/postgres/pgdata/pgroot/data patroni

#- name: PATRONI_POSTGRESQL_DATA_DIR
#value: /home/postgres/pgdata/pgroot/data
#- name: PATRONI_POSTGRESQL_PGPASS
#value: /tmp/pgpass
#- name: PATRONI_POSTGRESQL_LISTEN
#value: 0.0.0.0:5432
#- name: PATRONI_RESTAPI_LISTEN
#value: 0.0.0.0:8008

#PATRONI_SUPERUSER_USERNAME
#PATRONI_SUPERUSER_PASSWORD
#PATRONI_REPLICATION_USERNAME
#PATRONI_REPLICATION_PASSWORD
#APP_USER
#APP_PASSWORD
#APP_DATABASE
#docker run -d --name api -p 3333:3333 -u 1001 --read-only -e DB_PASSWORD=test -e DB_NAME=api-db -e DB_USERNAME=postgres -e DB_HOST=localhost -e DB_TYPE=postgres -e DB_PORT=5432 api
