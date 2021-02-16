const env = require('../util/env');
const spawn = require('../util/spawn');
const path = require('path');
const { getOptionalArg } = require('../util/args');
const { selectProjectPrompt } = require('../util/prompt');

// Get the optional script `project` argument, and build the project source.
getOptionalArg('project')
  .then(buildProject)
  .catch(console.error)
  .finally(process.exit);

/**
 * Builds the source code for a given node project.
 * @param {string} project The name of the project that shall be built.
 * @return {Promise<void>} A promise that resolves once the build operation completes.
 */
async function buildProject(project) {
  if (!project) {
    project = await selectProjectPrompt();
  }
  env(project); // Be sure to init utilized .env based on selected project.

  const isWeb = (project === 'web');
  const distDir = (isWeb ? global['serverWebDistDir'] : global['serverAdminDistDir']);
  const projectDir = (isWeb ? global['serverWebDir'] : global['serverAdminDir']);
  const tsconfigPathname = path.join(projectDir, 'tsconfig.json');

  await spawn('rimraf', [path.join(distDir, '*')]);
  await spawn('tsc', ['-p', tsconfigPathname]);
  await spawn('node', [path.join(global['serverToolsDir'], 'templates', 'precompile.js')])
}
