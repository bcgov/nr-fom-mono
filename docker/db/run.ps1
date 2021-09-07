docker run -d --name fom-db -u postgres -p 8008:8008 -p 6432:5432 -v data:/var/lib/postgresql/fom-db-data:rw -e POSTGRES_DB=fom -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=test fom-db

