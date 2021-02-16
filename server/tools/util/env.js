const path = require('path');

// Setup global path vars.
global['rootDir']             = path.join(__dirname, '..', '..', '..');
global['serverDir']           = path.join(global['rootDir'], 'server');
global['serverToolsDir']      = path.join(global['serverDir'], 'tools');
global['databaseToolsDir']    = path.join(global['serverToolsDir'], 'database');
global['databaseToolsJsDir']  = path.join(global['databaseToolsDir'], 'js');
global['sqlDumpDir']          = path.join(global['databaseToolsDir'], 'dump');
global['sqlScriptsDir']       = path.join(global['databaseToolsDir'], 'sql');
global['serverProjectsDir']   = path.join(global['serverDir'], 'projects');
global['serverAdminDir']      = path.join(global['serverProjectsDir'], 'admin');
global['serverWebDir']        = path.join(global['serverProjectsDir'], 'web');
global['serverWebDistDir']    = path.join(global['serverDir'], 'dist');
global['serverAdminDistDir']  = path.join(global['serverDir'], 'admin-dist');
global['serverTemplatesDir']  = path.join(global['serverDir'], 'templates');

let envInit = false;

/**
 * Initializes the environment variables for a given project.
 * Performs an idempotent operation, so repeated calls will not result in different environment state (only works once).
 * @param {'web' | 'admin'} project The optional project name to init the environment variables for. Defaults to 'web'.
 */
function env(project = 'web') {
  if (!envInit) {
    envInit = true;
    const projectDir = (project === 'web') ? global['serverWebDir'] : global['serverAdminDir'];
    const envPath = path.join(projectDir, '.env');
    require('dotenv').config({
      path: envPath
    });

    // Set PGPASSWORD env variable in order to run pg_dump without being prompted for password.
    process.env.PGPASSWORD = (process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : 'foodweb');
  }
}

module.exports = env;
