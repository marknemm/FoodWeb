###################
## -- FoodWeb -- ##
###################

## Overview

FoodWeb is a web platform designed to minimize food waste within the community. All of the non-client/server specific commands below should be run form within the project's root directory.

## Install

Run `npm install` to install all (client and server) dependencies. This may take some time depending on your machine.

## Run

Run `npm start` to build and watch the client source code, build and watch the server source code, and spin up a TS Node server that watches for changes in the source code. Navigate to `http://localhost:5000/` to view the app.

## Debug (VS Code)

Run the `Hybrid` debug configuration to build and watch all code, start a TS Node server with a Node debugger attached, and open up a Chrome web browser with a debugger attached. If the browser does not attempt to automatically navigate you to `http://localhost:5000`, then ensure that you do not have any other chrome browser instances open and repeat. Be patient, since the build process may take some time depending on your machine. If the webpage does not load initially, attempt to periodically reload it until you can see the website. You can place breakpoints anywhere throughout the client and server source code. Any changes that are made to the client source code should cause it to be rebuilt. Any changes made to the server source code should cause it to be rebuilt, and the TS Node server should restart with the debugger attached.

## build

Run `npm run build` to build both the client and server code.

## lint

Run `npm run lint` to lint both the client and server code.

## test

Run `npm run test` to lint and test both the client and server code. Additionally, code coverage reports should be generated when the tests complete.


##################
## -- Client -- ##
##################

## Overview

The FoodWeb client is an `Angular` project found under the client directory. All commands described below which target the client should be ran from whithin the `client/` directory. All source code can be found under `client/src/app/`. All test code can be found along side its respective source code.

## Install

Run `npm install` to install all client dependencies. This may take some time depending on your machine.

## Run

Run `npm start` to spin up an Angular 2 dev server. Navigate to `http://localhost:4200/`. The app will be running in HMR mode, and therefore, should automatically rebuild the source code and update the webpage whenever changes are made.

## Code scaffolding

Run `ng generate component` to generate a new Angular component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `npm run build` to build the Angular project. The build artifacts will be stored in the `dist/` directory.

## Lint

Run `npm run lint` to perform linting on the source code.

## Test

Run `npm run test` to lint and test the source code. Upon completion of unit testing, a code coverage report will be generated. The output of the code coverage report can be found under `client/coverage/`.

Run `npm run test:watch` to spin up an Angular server that will test the source code, and watch for changes to run tests against. A code coverage report will be generated whenever the tests complete.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



##################
## -- Server -- ##
##################

## Overview

The FoodWeb server is a `TS Node` project found under the server directory. All commands described below which target the server should be ran from whithin the `server/` directory. All source code can be found under `server/src/`. All email (handlebar) templates can be found under `server/templates/`. All test code can be found under `server/test/`.

## Install

Run `npm install` to install all client dependencies. This may take some time depending on your machine.

## Run

Run `npm start` to spin up a Node server. The server will watch for any changes to transpiled source code. Whenever a change is made to the source, transpilation will automatically occur.

## Build

Run `npm run build` to build the TS Node project. The build artifacts will be found in the dist/ directory.

## Lint

Run `npm run lint` to perform linting on the source code.

## Test

Run `npm run test` to lint and test the source code.

Run `npm run test:watch` to test and watch the source code. Whenever a change is made, tests will be run against the source code.

## Update Database Schema

Run `npm run typeorm:migration:generate <script_name>` to auto-generate a migration script for updating the database schema. The script will be placed under server/src/migration/. The changes in the script will be based off of any differences that TypeORM detects between the current database schema and entities defined under server/src/entity/. After generating the migration script, ensure that no additional side-effects were created for the migration. Also, perform any intermediate updates required for the migration (e.g. initialize a new table column as nullable, insert the correct data, and change the column to not nullable). Finally, place a guard on the up migration to prevent any accidental double application of the migration (e.g. If adding a column, check if the column exists before adding it).

Run `npm run typeorm:migration:create <script_name>` to create an empty migration script for updating the database schema. See `npm run typeorm:migration:generate` for more details.

Run `npm run typeorm:migration:run` to manually apply all migrations under server/src/migration/. You can also simply start the app (server), and all migrations will automatically be applied.

Run `npm run typeorm:migration:revert` to revert all migrations under server/src/migration/. Do this with care since it will end up clearing your development database.
