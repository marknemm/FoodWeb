const tsconfig = require('./tsconfig');

const config = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    paths: tsconfig.compilerOptions.paths,
    strict: false,
    types: [
      "jasmine",
      "node"
    ]
  },
  files: [
    "src/test.ts",
    "src/polyfills.ts"
  ],
  include: [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
};

module.exports = config;
