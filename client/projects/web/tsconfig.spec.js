const tsconfig = require('./tsconfig');

const config = {
  extends: "../../tsconfig.json",
  compilerOptions: {
    paths: tsconfig.compilerOptions.paths,
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
