# a***Sense AG API
This repository provides a Node/TypeScript and Postgres based back-end for the gas station management application.
# Demo
**This API is running on http://5.75.231.18:3080 with OpenAPI documentation available on http://5.75.231.18:3080/api-docs**
To access the endpoints, you need to provide this Bearer token in header:

    Authorization: Bearer c8a7a7f4-c1a2-4c2a-a193-ea6d7ed720d6
# Local setup instructions
Requirements:

 - docker
 - Node.js >=**16.0.0**

#### Set up a PostGIS-capable Postgres instance
To set up the database, you can run a command:

    docker run --name asense-postgis -e POSTGRES_PASSWORD=nmf3vZAD -d -p 5432:5432 postgis/postgis
This will start up a Postgres instance on localhost:5432 and will be accessible with username=*postgres*, password=*nmf3vZAD*, database=*postgres*
#### Set up the API service
This back-end has not been dockerized. To set it up, clone this repository and install the dependencies:

    $ cd asense-api
    $ npm install
To create the necessary tables, indices and users in the database, you need to set up environment variables and run the migration script:

    $ cp .env.example .env
    $ npm run migrate
To start the service, run:

    $ npm run serve
*Back-end will be available from port :3080*

# Todo

 - Unit test coverage
 - Integration test coverage
 - Docker and Docker-Compose stack setup
 - Implement pagination for gas station listing endpoint
