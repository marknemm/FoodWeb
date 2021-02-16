# FoodWeb Server

A **TS Node** monorepo project that leverages the **Express** framework.<br>
It is comprised of 2 projects:

  - **Web**: Located under **/server/projects/web**. Serves as the back-end for the standard web interface & Android/IOS apps.
  - **Admin**: Located under **/server/projects/admin**. Serves as the back-end for the admin console. It extends the capabilities of the Web project.



## Recommended Run Method

It is recommended that you run the server locally, and all related services (PostgreSQL, Redis, Fake SMTP Server) within docker. See `Run` under `NPM Scripts` below. You can alternatively run the server within a docker container, but this is not recommended. Also, if attempting to run the server within a docker container on *Windows*, nodemon will not reload on file changes unless the `-L` flag for legacy file system watch is used.



## NPM Scripts

All server npm scripts are found within **package.json**. The following may not be a comprehensive list, so feel free to view the source.

### Install Dependencies

Run `npm install` to install all server dependencies.

### Run

Run `npm start [project]` to spin up a nodemon server.
Before spinning up the server locally, it will also start all service dependencies such as **PostgreSQL**, **Redis**, and **Fake SMTP Server** within their respective docker containers.
You can either specify a project up front, or select from a list of server projects to build.

### Build

Run `npm run build [project]` to perform a production build of the TS Node server code.
You can either specify a project up front, or select from a list of server projects to build.

### Lint

Run `npm run lint [project]` to perform linting on the server source code.
You can either specify a project up front, or select from a list of server projects to lint.

### Test

Run `npm run test` to lint and test the server source code.

Run `npm run test:watch` to test and watch the server source code. Whenever a change is made, tests will be run against the source code.

### Update Database Schema

Run `npm run typeorm [command]` to execute a supported TypeORM CLI command.
You can either specify a command up front, or select form a list of supported commands.

Run `npm run typeorm generate` to auto-generate a migration script for updating the database schema.
It will prompt you for the name of the script, and the script will be placed under **server/projects/web/src/database/migration/**.

Run `npm run typeorm create` to create an empty migration script for updating the database schema.
It will prompt you for the name of the script, and the script will be placed under **server/projects/web/src/database/migration/**.

Run `npm run typeorm run` to manually apply all pending TypeORM migrations under **server/projects/web/src/database/migration/**.
You can also simply start the app (server), and all migrations will automatically be applied.

Run `npm run typeorm revert` to revert the latest TypeORM migration under **server/projects/web/src/database/migration/**.

### Database Automation Scripts

Run `npm run pg [command]` to execute a supported PostgreSQL (psql) CLI command.
You can either specify a command up front, or select form a list of supported commands.

Run `npm run pg dump [outFile]` to dump out a SQL script that can be used to restore the current state of your development foodweb database. 
You can either specify the output file up front, or specify it when prompted by the script.
All dump files are placed under **server/tools/database/dump**.

Run `npm run pg initialize [force]` to (re)initialize the PostgreSQL database schema and content.
If you specify a value of true for the *force* option, then the database will be reinitialized even though it was previously initialized.

Run `npm run pg make-timestamps-relevant` to make all timestamps within the database relevant to the current time. For example, this will ensure that all donations which have expired are moved to a near-by future date so that they are no longer expired.

Run `npm run pg query [sql]` to issue a SQL query against your PostgreSQL development database.
You can either specify a SQL query or SQL file pathname up front, or input a query when prompted to do so by the script.

Run `npm run pg restore [inFile]` to restore the database schema and content from an available dump file located under **server/tools/database/dump**.
You can either specify the input file up front, or select form a lis tof available dump file.
