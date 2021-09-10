# FoodWeb

A hybrid app that has the purpose of minimizing food waste within the community by automating & facilitating food donations.<br>
It is comprised of 3 core node projects:

  - **Client**: Located under **/client**. This is a front-end **Angular** monorepo. View its [README.md](https://github.com/marknemm/FoodWeb/blob/master/client/README.md) for more details.
  - **Server**: Located under **/server**. This is a back-end **TS Node** monorepo. View its [README.md](https://github.com/marknemm/FoodWeb/blob/master/server/README.md) for more details.
  - **Shared**: Located under **/shared**. This consists of **Typescript** source that is shared between Client & Server.

## Setup Methods

There are 2 possible setup methods. You can only work with 1. It is recommended that you proceed with the **Docker Setup** method.

Concerning the generation of API keys, you may either ask the FoodWeb team for a private key, or you may generate your own. **Ensure that you do not disclose these API keys to the public!**



### Docker Setup

This is the simplest setup. If using **Windows 10 Home Edition** make sure you follow any instructions pertaining to setting up WSL.

#### Required Downloads:

  - [Docker](https://docs.docker.com/install/)

#### Directions:

  1. Pull/Build all docker images and spin-up all containers via: `docker-compose up -d foodweb`.
  2. Update the generated **/server/projects/web/.env** file by setting the following variables to valid API keys:
      - **DISTANCE_TIME_API_KEY**
      - **DIRECTIONS_API_KEY**
      - **GEOCODER_API_KEY**
  3. Start developing!

Note that it is also recommended that you at least install the psql CLI for PostgreSQL in order to execute commands and examine the database from your local machine; although, this is not required. Feel free to install [Postgresql Server](https://www.postgresql.org/download/) v11.6.

### Local Setup

#### Required Downloads:

  - [Postgresql Server](https://www.postgresql.org/download/) v11.6
  - PostGIS Extension - Available at end of Postgresql Server install
  - [Redis](https://redis.io/download) v5.x
  - [Fake SMTP Server](https://github.com/ReachFive/fake-smtp-server) - `npm install -g fake-smtp-server`

#### Directions:

  1. Within the */server* directory, run `npm run dotenv:generate` and `npm run admin:dotenv:generate` to generate the starter **.env** files for each back-end project.
  2. Edit the generated **/server/projects/\*\*/.env** files by changing the following hostnames to **localhost**:
      - **foodweb**
      - **postgres**
      - **redis**
  3. Update the generated **/server/projects/\*\*/.env** files by setting the following variables to valid API keys:
      - **DISTANCE_TIME_API_KEY**
      - **DIRECTIONS_API_KEY**
      - **GEOCODER_API_KEY**
  4. Start the Postgresql Server if not already started.
  5. Start the Redis Server if not already started.
  6. Start the Fake SMTP Server via CLI: `fake-smtp-server`.
  7. Within the /server directory, run `npm run pg:initialize` to initialize development data within your local postgres database.
  8. Run `npm start` to start both the /server and /client portions of FoodWeb.
  9. Start developing!

  

## Recommended VS Code Extensions

  - **Angular Essentials**: Pick the highest version. Provides a ton of necessary support for Angular development such as **Angular Language Service** for template intellisense.
  - **Docker**: Provides a Docker VS Code menu with a UI for viewing and interacting with docker entities (container, images, etc).
  - **PostgreSQL**: Pick the one with the highest rating. Provides a VS Code menu with a UI for establishing connections to databases.
  - **easy-redis**: Provides a VS Code explorer panel which contains a UI for establishing connections to Redis Server instances.
  - **GitLens — Git supercharged**: Provides extended Git functionality within VS Code.
  - **DotENV**: Provides syntax highlighting for .env files.
  - **Rainbow CSV**: Provides color coding of CSV columns to make them more readable.
  - **IntelliSense for CSS class names in HTML**: Provides intellisense for referencing CSS class names.



## Recommended Run Methods

See the **README.md** files under the `client` & `server` directories for the recommended run methods specific to the front-end & back-end respectively.



## Debugging Options

All of the following debugging options are defined in **.vscode/tasks.json**, and can be ran under the VS Code debugging tab.

Also, keep in mind that each node project within FoodWeb has specialized debugging tasks defined. View the README.md files in the `client` and `server` directories for more details.

### Hybrid Attach

Run the `Hybrid Attach` debug configuration to:

  - Attach a **node debugger** to port **9229**.
  - Attach a **Chrome debugger** to port **9222**. NOTE: chrome must be started in debug mode for this to function.

### Hybrid Admin Attach

Run the `Hybrid Admin Attach` debug configuration to:

  - Attach a **node debugger** to port **9230**.
  - Attach a **Chrome debugger** to port **9222**. NOTE: chrome must be started in debug mode for this to function.



## NPM Scripts

All top-level npm scripts are found within **package.json**. The following may not be a comprehensive list, so feel free to view the source.

Also, keep in mind that each node project within FoodWeb has separate npm scripts; many of which are delegated to by the top level scripts.

### Install Dependencies

Run `npm install` to install all dependencies on your host machine.

### Build Web

Run `npm run build` to perform a production build of both the client and server code.

### Build Admin

Run `npm run admin:build` to perform a production build of both the client and server admin code.

### Lint

Run `npm run lint` to lint both the client and server code.

### Test

Run `npm run test` to lint and test both the client and server code. Additionally, code coverage reports should be generated when the tests complete.
