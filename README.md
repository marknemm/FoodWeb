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

  1. In Docker Settings under Resources -> File Sharing, ensure that you enable sharing of the **C drive**.
  2. In Docker Settings under Resources -> Advanced, increase the number of CPUs and amount of memory as you see fit.
  2. Pull/Build all docker images and spin-up all containers via: `docker-compose up -d foodweb`.
  3. Update the generated **/server/projects/web/.env** file by setting the following variables to valid API keys:
      - **DISTANCE_TIME_API_KEY**
      - **DIRECTIONS_API_KEY**
      - **GEOCODER_API_KEY**
  4. Start developing!


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

## App Development Setup

In order to work on the NativeScript app, you must first prepare by installing the necessary tools and setting up required environment variables.
Note that you cannot develop for the iOS platform on a Windows machine, so you can skip any steps related to iOS setup.

### Directions:

  1. Globally install the latest NativeScript CLI via `npm install -g nativescript`.

#### Android Directions:

  1. Install [Android Studio](https://developer.android.com/studio/install).
  2. Start **Android Studio** so that you are prompted to install the necessary emulator, tools, and AVD(s). Perform all necessary installs.
  3. Set the envrionemnt variable **ANDROID_HOME** to the Android SDK directory that was installed in the previous step. On Windows, this path is usually `C:\Users\<username>\AppData\Local\Android\Sdk`. On Mac, this path is usually `~/Library/Android/sdk`.
  4. Add the paths for typical Android SDK tools to your global environment **PATH** variable. The required paths should be `$ANDROID_HOME/tools`, `$ANDROID_HOME/tools/bin`, and `$ADNROID_HOME/platform-tools`.
  5. Ensure that you open a new shell session, and run the command `nsc doctor` to determine if any more setup is necessary for your NativeScript Android environment. This should also show you iOS requirements that are not met. Those will be convered in the next section.
  6. Run `cd ./client` to move into this project's client directory. In here, run `npm start app:android` to test out starting the FoodWeb app inside an Android emulator.

#### iOS Directions:

  1. Install **Xcode** via the App Store.
  2. Start **Xcode** and follow any necessary steps that may prompt you for additional installs/actions.
  3. Ensure that you open a new shell session, and run the command `nsc doctor` to determine if any more setup is necessary for your NativeScript iOS envrionment. This should also show you Android requirements that are not met. Those are covered in the previous section.
  4. Run `cd ./client` to move into this project's client directory. In here, run `npm start app:ios` to test out starting the FoodWeb app inside an iOS simulator.

## Recommended VS Code Extensions

  - **Angular Essentials**: Pick the highest version. Provides a ton of necessary support for Angular development such as **Angular Language Service** for template intellisence.
  - **Docker**: Provides a Docker VS Code menu with a UI for viewing and interacting with docker entities (container, images, etc).
  - **PostgreSQL**: Pick the one with the highest rating. Provides a VS Code menu with a UI for establishing connections to databases.
  - **easy-redis**: Provides a VS Code explorer panel which contains a UI for establishing connections to Redis Server instances.
  - **GitLens — Git supercharged**: Provides extended Git functionality within VS Code.
  - **DotENV**: Provides syntax highlighting for .env files.
  - **Rainbow CSV**: Provides color coding of CSV columns to make them more readable.
  - **IntelliSense for CSS class names in HTML**: Provides intellisense for referencing CSS class names.



## Docker Commands

All of the following Docker Commands can be run via VS Code tasks under the **Terminal** menu in the header.
Feel free to lookup and use the raw docker commands by viewing **.vscode/tasks.json**.

Also, note that each node project within FoodWeb has specialilzed docker commands described in the projects' README.md files.

### Start Web

Run the VS Code task `Docker FoodWeb: Start` to:

  - Perform an initial install of all dependencies.
  - Start a postgres docker container which exposes port **5432**.
  - Start a redis docker container which exposes port **6379**.
  - Start a fake-smtp-server docker container which exposes a web interface on port **1080**, and SMTP server on port **1025**.
  - Start a foodweb-server docker container which exposes a node.js app on port **5000** and a debugger on port **9229**.
  - Start a foodweb docker container which exposes an Angular app on port **4200**.

Navigate to `http://localhost:4200` to view the web app.

### Start App

Run the VS Code task `Docker FoodWeb App: Start` to:

  - Perform an initial install of all dependencies.
  - Start a postgres docker container which exposes port **5432**.
  - Start a redis docker container which exposes port **6379**.
  - Start a fake-smtp-server docker container which exposes a web interface on port **1080**, and SMTP server on port **1025**.
  - Start a foodweb-server docker container which exposes a node.js app on port **5000** and a debugger on port **9229**.
  - Start a foodweb-app docker container which exposes an Angular/Cordova (browser) app on port **8100**.

Navigate to `http://localhost:8100` to view the mobile app in browser.
Note that when running in browser, the app will not have access to mobile device capabilities (eg. push notifications).
See [README.md](https://github.com/marknemm/FoodWeb/blob/master/client/README.md) for details concerning how to emulate/simulate the mobile app.

### Start Admin

Run the VS Code task `Docker FoodWeb Admin: Start` to:

  - Perform an initial install of all dependencies.
  - Start a postgres docker container which exposes port **5432**.
  - Start a redis docker container which exposes port **6379**.
  - Start a fake-smtp-server docker container which exposes a web interface on port **1080**, and SMTP server on port **1025**.
  - Start a foodweb-admin-server docker container which exposes a node.js app on port **5001** and a debugger on port **9230**.
  - Start a foodweb-admin docker container which exposes an Angular app on port **4201**.

Navigate to `http://localhost:4201` to view the admin console.

### Reinstall Dependencies

Run the VS Code task `Docker FoodWeb: Reinstall Dependencies` to reinstall dependencies within a running foodweb container.

### Reinstall Admin Dependencies

Run the VS Code task `Docker FoodWeb Admin: Reinstall Dependencies` to reinstall dependencies within a running foodweb-admin container.

### View Log Output

Run the VS Code task `Docker Logs` to view & follow all Docker log output.



## Debugging Options

All of the following debugging options are defined in **.vscode/tasks.json**, and can be ran under the VS Code debugging tab.

Also, keep in mind that each node project within FoodWeb has specialized debugging tasks defined.

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

### Start All 
  - Make sure docker is running
  - Run docker-compose up -d foodweb-services on terminal
  - Run cd ./server
  - Run npm start
  - In another terminal, run cd ./client
  - Run npm start


### Start Web

Run `npm start` to concurrently: 

  - Build & watch the web client source code.
  - Build & watch the web server source code.
  - Spin-up an **Angular dev** server on port **4200** that restarts whenever client code rebuilds.
  - Spin-up a **nodemon** server on port **5000** that restarts whenever the server code rebuilds.

Navigate to `http://localhost:4200` to view the web app.

### Start App

Run `npm run app:start` to concurrently:

  - Build & watch the app client source code.
  - Build & watch the web server source code.
  - Spin-up an **Angular dev** server on port **8100** that restarts whenever the client code rebuilds.
  - Spin-up a **nodemon** server on port **5000** that restarts whenever the server code rebuilds.

Navigate to `http://localhost:8100` to view the mobile app in browser.

### Start Admin

Run `npm run admin:start` to concurrently:

  - Build & watch the admin client source code.
  - Build & watch the admin server source code.
  - Spin-up an **Angular dev** server on port **4201** that restarts whenever the client code rebuilds.
  - Spin-up a **nodemon** server on port **5001** that restarts whenever the server code rebuilds.

Navigate to `http://localhost:4201` to view the admin console.

### Build Web

Run `npm run build` to perform a production build of both the client and server code.

### Build Admin

Run `npm run admin:build` to perform a production build of both the client and server admin code.

### Lint

Run `npm run lint` to lint both the client and server code.

### Test

Run `npm run test` to lint and test both the client and server code. Additionally, code coverage reports should be generated when the tests complete.
