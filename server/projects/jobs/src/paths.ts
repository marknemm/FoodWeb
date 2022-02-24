import path = require('path');
import tsconfigPaths = require('tsconfig-paths');

export const appPaths = {
  rootDir: '',
  serverDir: '',
  serverWebDir: '',
  serverProjectDir: '',
  serverDistDir: '',
  serverDistBaseDir: '',
  emailTemplatesDir: '',
};

/**
 * Initializes all global path constants and path mappings for the lambda function process.
 *
 * If it is detected that this is deployed to AWS lambda, then maps all job specific paths to flat directory,
 * and maps path (import/require) aliases to the `/opt/*` directories where lambda layers are placed.
 *
 * If it is detected that this is a local instance, then maps paths to the original directory structure found in repo,
 * and uses the local `tsconfig.json` file to derive path (import/require) aliases.
 */
export function initPaths(): void {
  // Setup global path constants.

  // Deployed to AWS Lambda or on local machine / docker?
  if (process.env.PRODUCTION === 'true' || process.env.QA === 'true') {
    appPaths.rootDir           = path.join('/');
    appPaths.serverDir         = __dirname;
    appPaths.serverWebDir      = __dirname;
    appPaths.serverProjectDir  = __dirname;
    appPaths.serverDistDir     = __dirname;
    appPaths.serverDistBaseDir = __dirname; // This is the project dist root (e.g. **/dist/server/projects/web).
    appPaths.emailTemplatesDir = path.join('/', 'opt', 'templates');
  } else {
    appPaths.rootDir           = path.join(__dirname, '..', '..', '..', '..', '..', '..'); // __dirname refers to compile dist output location.
    appPaths.serverDir         = path.join(appPaths.rootDir, 'server');
    appPaths.serverWebDir      = path.join(appPaths.serverDir, 'projects', 'web');
    appPaths.serverProjectDir  = path.join(appPaths.serverDir, 'projects', 'jobs');
    appPaths.serverDistDir     = path.join(appPaths.serverDir, 'dist', 'server');
    appPaths.serverDistBaseDir = path.join(__dirname, '..'); // This is the project dist root (e.g. **/dist/server/projects/web).
    appPaths.emailTemplatesDir = path.join(appPaths.serverDistDir, 'templates', 'email');
  }

  // Setup path alias resolution for JS (allows compilerOptions.paths to be used from tsconfig.json).
  initTsconfigPaths();
}

/**
 * Initializes the usage and handling of tsconfig.json compilerOptions.paths mappings.
 */
function initTsconfigPaths(): void {
  if (process.env.PRODUCTION === 'true' || process.env.QA === 'true') {
    tsconfigPaths.register({
      baseUrl: '/',
      paths: {
        '~entity': [path.join('/', 'opt', '~web', 'database', 'entity', 'index')],
        '~jobs/*': [path.join(appPaths.serverDistDir, '*')],
        '~orm': [path.join('/', 'opt', '~web', 'database', 'orm', 'index')],
        '~shared': [path.join('/', 'opt', '~shared', 'index')],
        '~web/*': [path.join('/', 'opt', '~web', '*')]
      }
    });
  } else {
    const tsconfig = require(path.join(appPaths.serverProjectDir, 'tsconfig.json'));
    tsconfigPaths.register({
      baseUrl: appPaths.serverDistBaseDir,
      paths: tsconfig.compilerOptions.paths
    });
  }
}
