## Database Migration Setup

There are two sets of migrations - main and test. The main migrations are designed to be run in all environments. The test migrations are only meant to populate test data for test environments. Both sets of migrations are run automatically at startup of the API process (see main.ts). The test migration only runs if environment variable DB_TESTDATA is set to true.

Both the main and test migrations use typeorm:migration with timestamps to control the ordering, but note that all of the main migrations are run before any of the test migrations, irrespective of their respective timestamps.

Migration scripts are written in javascript (.js) and not typescript deliberately, in order to make build & execution post-build easier.
On build, migration scripts are treated similar to assets and copied into the dist directory. This is configured in workspace.json
On execution, the migration config (in ormconfig-migration-{main|test}.ts loads migration directories for both the source working tree and for the dist setup.

### To create a new migration

- typeorm migration:create -o -n {name}
- Copy resulting file into migrations/main or migrations/test

