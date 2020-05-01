const path = require('path');
const webTsconfig = require('../web/tsconfig');

// Update all web project path mappings to be relative to the admin project directory.
const webPaths = {};
for (const webPath in webTsconfig.compilerOptions.paths) {
  const webPathMappings = webTsconfig.compilerOptions.paths[webPath];
  webPaths[webPath] = webPathMappings.map((webPathSrc) => path.join('..', 'web', webPathSrc).replace(/\\/g, '/'));
}

const config = {
  extends: "../../tsconfig.json",
  compilerOptions: {
    baseUrl: "./",
    paths: Object.assign(webPaths, {
      "~admin/admin-account/*": [
        "./src/app/admin-account/*",
        "./src/app/admin-account/child-components/*",
        "./src/app/admin-account/components/*",
        "./src/app/admin-account/directives/*",
        "./src/app/admin-account/forms/*",
        "./src/app/admin-account/interfaces/*",
        "./src/app/admin-account/pipes/*",
        "./src/app/admin-account/services/*"
      ],
      "~admin/admin-app-shell/*": [
        "./src/app/admin-app-shell/*",
        "./src/app/admin-app-shell/child-components/*",
        "./src/app/admin-app-shell/components/*",
        "./src/app/admin-app-shell/directives/*",
        "./src/app/admin-app-shell/forms/*",
        "./src/app/admin-app-shell/interfaces/*",
        "./src/app/admin-app-shell/pipes/*",
        "./src/app/admin-app-shell/services/*"
      ],
      "~admin/admin-delivery/*": [
        "./src/app/admin-delivery/*",
        "./src/app/admin-delivery/child-components/*",
        "./src/app/admin-delivery/components/*",
        "./src/app/admin-delivery/directives/*",
        "./src/app/admin-delivery/forms/*",
        "./src/app/admin-delivery/interfaces/*",
        "./src/app/admin-delivery/pipes/*",
        "./src/app/admin-delivery/services/*"
      ],
      "~admin/admin-donation/*": [
        "./src/app/admin-donation/*",
        "./src/app/admin-donation/child-components/*",
        "./src/app/admin-donation/components/*",
        "./src/app/admin-donation/directives/*",
        "./src/app/admin-donation/forms/*",
        "./src/app/admin-donation/interfaces/*",
        "./src/app/admin-donation/pipes/*",
        "./src/app/admin-donation/services/*"
      ],
      "~admin/admin-event/*": [
        "./src/app/admin-event/*",
        "./src/app/admin-event/child-components/*",
        "./src/app/admin-event/components/*",
        "./src/app/admin-event/directives/*",
        "./src/app/admin-event/forms/*",
        "./src/app/admin-event/interfaces/*",
        "./src/app/admin-event/pipes/*",
        "./src/app/admin-event/services/*"
      ],
      "~admin/admin-session/*": [
        "./src/app/admin-session/*",
        "./src/app/admin-session/child-components/*",
        "./src/app/admin-session/components/*",
        "./src/app/admin-session/directives/*",
        "./src/app/admin-session/forms/*",
        "./src/app/admin-session/interfaces/*",
        "./src/app/admin-session/pipes/*",
        "./src/app/admin-session/services/*"
      ],
      "~admin/app.component": ["./src/app/app.component"],
      "~admin/app.module": ["./src/app/app.module"],
      "~admin/app-routing.module": ["./src/app/app-routing.module"],
      "~admin/bootstrap/*": [
        "./src/app/bootstrap/*",
        "./src/app/bootstrap/child-components/*",
        "./src/app/bootstrap/components/*",
        "./src/app/bootstrap/directives/*",
        "./src/app/bootstrap/forms/*",
        "./src/app/bootstrap/interfaces/*",
        "./src/app/bootstrap/pipes/*",
        "./src/app/bootstrap/services/*"
      ],
      "~admin/components/*": [ "./src/app/components/*" ],
      "~admin/developer/*": [
        "./src/app/developer/*",
        "./src/app/developer/child-components/*",
        "./src/app/developer/components/*",
        "./src/app/developer/directives/*",
        "./src/app/developer/forms/*",
        "./src/app/developer/interfaces/*",
        "./src/app/developer/pipes/*",
        "./src/app/developer/services/*"
      ],
      "~admin/environments/*": ["./src/environments/*"],
      "~admin/admin-password/*": [
        "./src/app/admin-password/*",
        "./src/app/admin-password/child-components/*",
        "./src/app/admin-password/components/*",
        "./src/app/admin-password/directives/*",
        "./src/app/admin-password/forms/*",
        "./src/app/admin-password/pipes/*",
        "./src/app/admin-password/interfaces/*",
        "./src/app/admin-password/services/*"
      ],
      "~shared": ["./src/shared"]
    }),
    sourceMap: true,
    types: ["node"]
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
