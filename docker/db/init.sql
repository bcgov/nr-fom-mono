-- Adapted from https://github.com/postgis/docker-postgis/blob/master/13-3.1/initdb-postgis.sh
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- FOM-specific extensions
create extension if not exists plpgsql; 
create extension if not exists pgcrypto;
