require('./constants');
const path = require('path');
const { getProjectDir } = require('./project');

let envInit = false;

/**
 * Initializes the environment variables for a given project.
 * Performs an idempotent operation, so repeated calls will not result in different environment state (only works once).
 * @param {string} project The optional project name to init the environment variables for. Defaults to 'web'.
 */
function env(project = 'web') {
  if (!envInit) {
    envInit = true;
    const projectDir = getProjectDir(project);
    const envPath = path.join(projectDir, '.env');
    require('dotenv').config({
      path: envPath
    });

    // Set PGPASSWORD env variable in order to run pg_dump without being prompted for password.
    process.env.PGPASSWORD = (process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : 'foodweb');
  }
}

module.exports = env;
