const env = require('../util/env');
const cleanBuild = require('../util/clean-build');
const path = require('path');
const spawn = require('../../../shared/tools/util/spawn');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { getProjectDir } = require('../util/project');
const { selectProjectPrompt } = require('../util/prompt');

// Get the optional script `project` argument, and build the project source.
getOptionalArg('project')
  .then(buildProject)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Builds the source code for a given node project.
 * @param {string} project The name of the server project that shall be built.
 * @return {Promise<void>} A promise that resolves once the build operation completes.
 */
async function buildProject(project) {
  if (!project) {
    project = await selectProjectPrompt();
  }
  env(project); // Be sure to init utilized .env based on selected project.

  const projectDir = getProjectDir(project);
  const tsconfigPathname = path.join(projectDir, 'tsconfig.json');

  await cleanBuild(project);
  await spawn('tsc', ['-p', tsconfigPathname]);
  await spawn('node', [path.join(global['serverToolsDir'], 'templates', 'precompile.js')])
}
