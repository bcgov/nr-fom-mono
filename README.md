[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)]

# Forest Operation Map (FOM)

FOM projects (proposals for logging, essentially) are submitted to FOM and made available for public review and comment. The submitting organization then needs to address the comments before submitting the project to the ministry.

## Technical Details

Technology Stack: Angular, Node.js, PostgresSQL with PostGIS running in OCP v4

This is a monorepo that includes the API backend and the two Angular front-ends.

## Third-Party Products/Libraries used and the licenses they are covered by

<!--- product/library and path to the LICENSE --->
<!--- Example: <library_name> - [![GitHub](<shield_icon_link>)](<path_to_library_LICENSE>) --->

## Documentation

See ministry Confluence site: https://apps.nrs.gov.bc.ca/int/confluence/pages/viewpage.action?pageId=83560736

## Security

<!--- Authentication, Authorization, Policies, etc --->

## Files in this repository

<!--- Use Tree to generate the file structure, try `tree -I '<excluded_paths>' -d -L 3`--->

## Getting Started

<!--- setup env vars, secrets, instructions... --->

## Local Development

Once set up, the stack can be access using the following paths on localhost:

- Postgres: localhost:5432
- API: localhost:3333/api
- Admin frontend: localhost:4200/admin
- Public frontend: localhost:4300/public


### Docker Compose

- Install docker and docker-compose
- Run `docker-compose up`

Individual components can be started separately or daemonized.
E.g. database in the background (daemonized), the api in the foreground:

```
docker-compose up -d db
docker-compose up api
```

### Local / Bare Metal

Fire up components using Docker Compose, but not the ones you want to work on locally.  Start commands are available in package.json.

OBJECT_STORAGE_SECRET = object storage secret, available in the OpenShift dev secret `fom-object-storage-dev`

Here's how to run only the public frontend locally:

```
# Database, api and admin in the background
docker-compose up -d db api admin

# Source local variables
source ./localdev.env      # Linux, MacOS
./localdev.env             # Windows

# Object storage secret
export OBJECT_STORAGE_SECRET=<hidden>

# Install node modules
npm i

# Build and run the public frontend
npm run start:public
```

### Connect to local database:

- Install dbeaver or pgadmin
- Ensure database is running (docker-compose up -d db && npm run typeorm:migrate)
- Create PostGRES connection to local database using connection information as defined in docker-compose.yml

### To rebuild local database from scratch
This drops and recreates the database and runs all migrations including test ones. (Although migrations are also run when starting the API component, test migrations only run at startup if environment variable DB_TESTDATA = true)
- npm run db:recreate

To explicitly delete database: 
- docker-compose down
- docker volume rm nr-fom-api_ms-postgres-data

## Application Specific Setup:

<!--- instruction on setup local environment and dependencies.. --->

This project uses the Nest API framework and the Nx monorepo platform / cli tools.
Nx is used to manage this repository and generate Nest components.
See FRAMEWORK.md for nrwl nx documentation.

## Client Library Generation
These are the steps to generate the client library used by the frontend components (Admin + Public)
- Code changes to the API that are documented in Swagger using Swagger annotations like @ApiTags, @ApiProperty 
- Start the API component (npm run start:api) and access http://localhost:3333/api-json. Copy this content to '/apps/api/openapi/swagger-spec.json'
- Remove the existing generated client library files. Delete the directories /libs/client/typescript-ng/{api|models}.
- Generate the client library using 'npm run gen:client-api:ng'. Generated files will be placed into '/libs/client/typescript-ng'
- Copy the client library into the Admin and Public components in /src/core/api

## Deployment (OpenShift)

See [OpenShift Readme](./openshift/README.md)

<!--- Best to include details in a openshift/README.md --->

## Getting Help or Reporting an Issue

<!--- Example below, modify accordingly --->

To report bugs/issues/feature requests, please file an [issue](../../issues).

## How to Contribute

If you would like to contribute, please see our [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

## License

    Copyright 2021 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
