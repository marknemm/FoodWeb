import dotenv = require('dotenv');
import path = require('path');

// If we are running a job as its own process, then we must set basic env config, otherwise skip.
if (!global['rootDir']) {
  global['rootDir'] = path.join(__dirname, '..', '..', '..', '..', '..');
  global['serverDir'] = path.join(global['rootDir'], 'server');
  global['clientDir'] = path.join(global['rootDir'], 'client');
  global['clientBuildDir'] = path.join(global['clientDir'], 'dist');
  global['assetsDir'] = path.join(global['clientBuildDir'], 'assets');
  global['clientEmailDir'] = path.join(global['clientDir'], 'email');
  global['publicDir'] = path.join(global['rootDir'], 'public');
  global['emailTemplatesDir'] = path.join(__dirname, '..', '..', 'templates', 'email');

  const envPath = path.join(global['serverDir'], '.env');
  dotenv.config({ path: envPath });
}
