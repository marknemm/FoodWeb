import path = require('path');
import tsconfigPaths = require('tsconfig-paths');

export const appPaths = {
  rootDir: '',
  serverDir: '',
  serverWebDir: '',
  serverProjectDir: '',
  serverDistDir: '',
  serverDistBaseDir: '',
  serverDbDumpDir: '',
  clientDir: '',
  clientBuildDir: '',
  assetsDir: '',
  clientEmailDir: '',
  publicDir: '',
  emailTemplatesDir: '',
};

/**
 * Initializes all global path constants and path mappings for the Express app.
 * @param project The name of the project that the paths are being intialized for (e.g. 'web', 'admin').
 * @param indexDirname The directory containing the index.js file in transpiled dist output.
 */
export function initPaths(project: string, indexDir: string): void {
  // Setup global path constants.
  appPaths.rootDir           = path.join(indexDir, '..', '..', '..', '..', '..', '..');
  appPaths.serverDir         = path.join(appPaths.rootDir, 'server');
  appPaths.serverWebDir      = path.join(appPaths.serverDir, 'projects', 'web');
  appPaths.serverProjectDir  = path.join(appPaths.serverDir, 'projects', project);
  appPaths.serverDistDir     = path.join(appPaths.serverDir, 'dist', 'server');
  appPaths.serverDistBaseDir = path.join(indexDir, '..'); // This is the project dist root (e.g. **/dist/server/projects/web).
  appPaths.serverDbDumpDir   = path.join(appPaths.serverDir, 'tools', 'database', 'dump');
  appPaths.clientDir         = path.join(appPaths.rootDir, 'client');
  appPaths.clientBuildDir    = path.join(appPaths.clientDir, 'dist', project);
  appPaths.assetsDir         = path.join(appPaths.clientBuildDir, 'assets');
  appPaths.clientEmailDir    = path.join(appPaths.clientDir, 'email');
  appPaths.publicDir         = path.join(appPaths.rootDir, 'public');
  appPaths.emailTemplatesDir = path.join(appPaths.serverDistDir, 'templates', 'email');

  // Setup path alias resolution for JS (allows compilerOptions.paths to be used from tsconfig.json).
  initTsconfigPaths();
}

/**
 * Initializes the usage and handling of tsconfig.json compilerOptions.paths mappings.
 */
function initTsconfigPaths(): void {
  const tsconfig = require(path.join(appPaths.serverProjectDir, 'tsconfig.json'));
  tsconfigPaths.register({
    baseUrl: appPaths.serverDistBaseDir,
    paths: tsconfig.compilerOptions.paths
  });
}
