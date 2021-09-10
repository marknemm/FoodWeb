# FoodWeb Client

An **Angular** monorepo that relies mostly on **Angular Material** for UI components.<br>
It is composed of 3 projects:

  - **Web**: Located under **/client/projects/web**. Serves as the standard web interface's front-end. It also provides a common base for all other projects.
  - **Hybrid**: Located under **/client/projects/hybrid**. Serves as the mobile Android/IOS apps' front-end. It leverages **Capacitor** & **Ionic** for mobile app features, and builds off of the capabilities of the Web project.
  - **Admin**: Located under **/client/projects/admin**. Serves as the admin console's front-end. It extends the capabilities of the Web project.



## Recommended Run Methods

On both Mac & Windows, it is recommended that you run the Angular client server on your local machine. See `Start Web` & `Start Admin` under `NPM Scripts` below.



## NPM Scripts

All client npm scripts are found within **package.json**. The following may not be a comprehensive list, so feel free to view the source.

### Install Dependencies

Run `npm install` to install all client dependencies.

### Start Web

Run `npm start` to spin up an Angular 2 dev server.<br>
Navigate to `http://localhost:4200`.

### Start Hybrid

Run `npm run hybrid:start` to spin up an App Angular 2 dev server.<br>
Navigate to `http://loclhost:8100`.

### Start Admin

Run `npm run admin:start` to spin up an admin Angular 2 dev server.<br>
Navigate to `http://localhost:4201`.

### Build Web

Run `npm run build` to perform a production build of the Angular client code.

### Build Admin

Run `npm run admin:build` to perform a production build of the Angular client admin code.

### Lint

Run `npm run lint` to perform linting on the client source code.

### Test

Run `npm run test` to lint and test the client source code. Additionally, code coverage reports should be generated when the tests complete. The output of the code coverage report can be found under **client/coverage/**.

Run `npm run test:watch` to spin up an Angular server that will test the source code, and watch for changes to run tests against. A code coverage report will be generated whenever the tests complete.

### Code scaffolding

Run `npm run ng generate component` to generate a new Angular component. You can also use `ng generate directive|pipe|service|class|module`.

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
