const path = require('path');
const webTsconfig = require('../web/tsconfig');

// Update all web project path mappings to be relative to the app project directory.
const webPaths = {};
for (const webPath in webTsconfig.compilerOptions.paths) {
  const webPathMappings = webTsconfig.compilerOptions.paths[webPath];
  webPaths[webPath] = webPathMappings.map((webPathSrc) => path.join('..', 'web', webPathSrc).replace(/\\/g, '/'));
}

const config = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    target: "es5",
    baseUrl: "./",
    paths: Object.assign(webPaths, {
      "~app/app.component": ["./src/app/app.component"],
      "~app/app.module": ["./src/app/app.module"],
      "~app/app-routing.module": ["./src/app/app-routing.module"],
      "~app/app-session/*": [
        "./src/app/app-session/*",
        "./src/app/app-session/child-components/*",
        "./src/app/app-session/components/*",
        "./src/app/app-session/directives/*",
        "./src/app/app-session/forms/*",
        "./src/app/app-session/pipes/*",
        "./src/app/app-session/interfaces/*",
        "./src/app/app-session/services/*"
      ],
      "~app/app-shared/*": [
        "./src/app/app-shared/*",
        "./src/app/app-shared/child-components/*",
        "./src/app/app-shared/components/*",
        "./src/app/app-shared/directives/*",
        "./src/app/app-shared/forms/*",
        "./src/app/app-shared/pipes/*",
        "./src/app/app-shared/interfaces/*",
        "./src/app/app-shared/services/*"
      ],
      "~app/bootstrap/*": [
        "./src/app/bootstrap/*",
        "./src/app/bootstrap/child-components/*",
        "./src/app/bootstrap/components/*",
        "./src/app/bootstrap/directives/*",
        "./src/app/bootstrap/forms/*",
        "./src/app/bootstrap/interfaces/*",
        "./src/app/bootstrap/pipes/*",
        "./src/app/bootstrap/services/*"
      ],
      "~app/components/*": ["./src/app/components/*"],
      "~app/environments/*": ["./src/environments/*"],
      "~shared": ["./src/shared"]
    }),
    types: [
      "node",
      "cordova",
      "cordova-plugin-device/types",
      "phonegap-plugin-push/types"
    ]
  },
  include: [
    "src/**/*.ts"
  ],
  exclude: [
    "src/test.ts",
    "src/**/*.spec.ts"
  ]
};

module.exports = config;
