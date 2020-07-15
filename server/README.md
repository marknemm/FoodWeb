# FoodWeb Server

A **TS Node** monorepo project that leverages the **Express** framework.<br>
It is comprised of 2 projects:

  - **Web**: Located under **/server/projects/web**. Serves as the back-end for the standard web interface & Android/IOS apps.
  - **Admin**: Located under **/server/projects/admin**. Serves as the back-end for the admin console. It extends the capabilities of the Web project.



## Docker Commands

All of the following Docker Commands can be run via VS Code tasks under the **Terminal** menu in the header.
Feel free to lookup and use the raw docker commands by viewing **.vscode/tasks.json**.

Also View the FoodWeb top-level [README.md](https://github.com/marknemm/FoodWeb/blob/master/README.md) for more available Docker commands.

### Start Web

Run the VS Code task `Docker FoodWeb: Start Server` to start the web server within the foodweb-server container.
Additionally, performs initial dependency installation and bootstraps all related server technologies.
Navigate to valid routes under `http://localhost:5000` to direclty invoke server REST route handlers.

### Start Admin

Run the VS Code task `Docker FoodWeb Admin: Start Server` to start the admin server within the foodweb-admin-server container.
Additionally, performs initial dependency installation and bootstraps all related server technologies.
Navigate to valid routes under `http://localhost:5001` to direclty invoke server REST route handlers.

### Reinstall Dependencies

Run the VS Code task `Docker FoodWeb: Reinstall Server Dependencies` to reinstall server dependencies within a running foodweb-server container.

### Reinstall Admin Dependencies

Run the VS Code task `Docker FoodWeb Admin: Reinstall Server Dependencies` to reinstall server dependencies within a running foodweb-admin-server container.

### Generate TypeORM Migration

Run the VS Code task `Docker FoodWeb: Generate TypeORM Migration` to generate a TypeORM database migration script. It will prompt you for the script name. The script will be placed under **server/projects/web/src/database/migration/**.

After generating the migration script, ensure that no additional side-effects were created for the migration. Also, perform any intermediate updates required for the migration (e.g. initialize a new table column as nullable, insert the correct data, and change the column to not nullable). Finally, place a guard on the up migration to prevent any accidental double application of the migration (e.g. If adding a column, check if the column exists before adding it).

### Create TypeORM Migration

Run the VS Code task `Docker FoodWeb: Create TypeORM Migration` to create a blank TypeORM database migration script, which will be. It will prompt you for the script name. The script will be placed under **server/projects/web/src/database/migration/**.

### Run TypeORM Migrations

Run the VS Code task `Docker FoodWeb: Run TypeORM Migrations` to manually run all pending TypeORM migrations under **server/projects/web/src/database/migration/**. Normally, a simple server restart may be used to run all necessary migrations.

### Revert TypeORM Migrations

Run the VS Code task `Docker FoodWeb: Revert TypeORM Migrations` to revert the latest TypeORM migration under **server/projects/web/src/database/migration/**.

### Dump Development Database

Run the VS Code task `Docker Foodweb: Dump Postgres Database` to dump the schema and contents of the development database into a specified file under **server/database-util/dump/**. It will prompt you for the optional dump file name.

### Restore Development Database

Run the VS Code task `Docker Foodweb: Restore Postgres Database` to restore the schema and contents of the development database to the state specified by a database dump file under **server/database-util/dump/**. It will prompt you for the optional restore dump file name.

### Destory Development Database

Run the VS Code task `Docker Foodweb: Destory Postgres Database` to destroy the schema and contents of the development database.


## NPM Scripts

All server npm scripts are found within **package.json**. The following may not be a comprehensive list, so feel free to view the source.

### Install Dependencies

Run `npm install` to install all server dependencies.

### Run

Run `npm start` to spin up a nodemon server on port **5000**.

### Run Admin

Run `npm run admin:start` to spin up an admin nodemon server on port **5001**.

### Build

Run `npm run build` to perform a production build of the TS Node server code.

### Build Admin

Run `npm run admin:build` to perform a production build of the TS Node server admin code.

### Lint

Run `npm run lint` to perform linting on the server source code.

### Test

Run `npm run test` to lint and test the server source code.

Run `npm run test:watch` to test and watch the server source code. Whenever a change is made, tests will be run against the source code.

### Update Database Schema

Run `npm run typeorm:migration:generate <script_name>` to auto-generate a migration script for updating the database schema. The script will be placed under **server/projects/web/src/database/migration/**.

Run `npm run typeorm:migration:create <script_name>` to create an empty migration script for updating the database schema. The script will be placed under **server/projects/web/src/database/migration/**.

Run `npm run typeorm:migration:run` to manually apply all pending TypeORM migrations under **server/projects/web/src/database/migration/**. You can also simply start the app (server), and all migrations will automatically be applied.

Run `npm run typeorm:migration:revert` to revert the latest TypeORM migration under **server/projects/web/src/database/migration/**.

### Database Automation Scripts

Run `npm run pg:initialize` To destroy the data and schema within your development foodweb database, and initialize it with standard data.

Run `npm run pg:dump` to dump out a SQL script that can be used to restore the current state of your development foodweb database. Optionally accepts a single argument specifying th e name of the output file. Defaults to 'default'. All dump files are placed under **server/database-util/dump**.

Run `npm run pg:destory` to destroy the data and schema within your development foodweb database.

Run `npm run pg:restore` to destroy the data and schema within your development foodweb database, and then restore it with the script generated from a previous SQL dump. Optionally accepts a single argument specifying the name of the restore dump file. Defaults to 'default'.
