const env = require('../util/env');
const path = require('path');
const spawn = require('../util/spawn');
const { getOptionalArg } = require('../util/args');
const { getProjectDir } = require('../util/project');
const { selectProjectPrompt } = require('../util/prompt');
const { promises: fs } = require('fs');

// Get the optional script `project` argument, and setup the project environment (.env) & database schema/contents.
getOptionalArg('project')
  .then(initProject)
  .catch(console.error)
  .finally(process.exit);

/**
 * Performs various initial setup for a given node project.
 * @param {string} project The name of the project to setup. If not given, then the user will be prompted for a project.
 * @return {Promise<void>} A promise that resolves once the initial install is complete.
 */
async function initProject(project) {
  if (!project) {
    project = await selectProjectPrompt();
  }
  env(project); // Be sure to init utilized .env based on selected project.

  // If '.env' file does not exist for the project that we are performing an initial install on, then generate it from '.env.example'.
  const projectDir = getProjectDir(project);
  const dotEnvPathname = path.join(projectDir, '.env');
  const dotEnvExamplePathname = path.join(projectDir, '.env.example');
  await fs.stat(dotEnvPathname).catch(() =>
    fs.copyFile(dotEnvExamplePathname, dotEnvPathname)
  );

  // Run the 'initialize.js' database util script, which will initialize the database if not already done.
  const initDBPathname = path.join(global['databaseToolsJsDir'], 'initialize.js');
  await spawn('node', [initDBPathname]);
}
