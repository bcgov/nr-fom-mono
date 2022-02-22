-- For local database running on developer's laptop, not used for deployed database
create extension if not exists postgis;
create extension if not exists postgis_topology;
create extension if not exists fuzzystrmatch;
create extension if not exists postgis_tiger_geocoder;

create extension if not exists pgcrypto;