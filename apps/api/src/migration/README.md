** Database Migration Setup

There are two sets of migrations - main and test. The main migrations are designed to be run in all environments. The test migrations are only meant to populate test data for test environments. Both sets of migrations are run automatically at startup of the API process (see main.ts). The test migration only runs if environment variable DB_TESTDATA is set to true.

Both the main and test migrations use typeorm:migration with timestamps to control the ordering, but note that all of the main migrations are run before any of the test migrations, irrespective of their respective timestamps.
