import dotenv = require('dotenv');
import path = require('path');
import tsConfigPaths = require('tsconfig-paths');

// If we are running a job as its own process, then we must set basic env config, otherwise skip.
if (!global['rootDir']) {
  // Setup path alias resolution for JS.
  const tsConfig = require('../../../../tsconfig.json');
  tsConfigPaths.register({
    baseUrl: path.join(__dirname, '..', '..'),
    paths: tsConfig.compilerOptions.paths
  });

  global['rootDir'] = path.join(__dirname, '..', '..', '..', '..', '..');
  global['serverDir'] = path.join(global['rootDir'], 'server');
  global['serverWebDir'] = path.join(global['serverDir'], 'projects', 'web');
  global['clientDir'] = path.join(global['rootDir'], 'client');
  global['clientBuildDir'] = path.join(global['clientDir'], 'dist');
  global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
  global['clientEmailDir'] = path.join(global['clientDir'], 'email');
  global['publicDir'] = path.join(global['rootDir'], 'public');
  global['emailTemplatesDir'] = path.join(__dirname, '..', '..', 'templates', 'email');

  const envPath = path.join(global['serverWebDir'], '.env');
  dotenv.config({ path: envPath });
}
