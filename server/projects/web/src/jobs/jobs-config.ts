import dotenv = require('dotenv');
import path = require('path');
import tsConfigPaths = require('tsconfig-paths');

// If we are running a job as its own process, then we must set basic env config, otherwise skip.
if (!global['rootDir']) {
  global['rootDir'] = path.join(__dirname, '..', '..', '..', '..', '..', '..', '..');
  global['serverDir'] = path.join(global['rootDir'], 'server');
  global['serverDistDir'] = path.join(global['serverDir'], 'dist', 'server');
  global['serverWebDir'] = path.join(global['serverDir'], 'projects', 'web');
  global['clientDir'] = path.join(global['rootDir'], 'client');
  global['clientBuildDir'] = path.join(global['clientDir'], 'dist');
  global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
  global['clientEmailDir'] = path.join(global['clientDir'], 'email');
  global['publicDir'] = path.join(global['rootDir'], 'public');
  global['emailTemplatesDir'] = path.join(global['serverDistDir'], 'templates', 'email');

  const envPath = path.join(global['serverWebDir'], '.env');
  dotenv.config({ path: envPath });

  const tsconfigPathname: string = path.join(global['serverWebDir'], 'tsconfig.json');
  const tsconfig = require(tsconfigPathname);
  tsConfigPaths.register({
    baseUrl: path.join(global['serverDistDir'], 'projects', 'web'), // This is the /dist/server/projects/web dir.
    paths: tsconfig.compilerOptions.paths
  });
}
