const env = require('../util/env');
const spawn = require('../util/spawn');
const path = require('path');
const { getOptionalArg } = require('../util/args');
const { selectProjectPrompt, projectOptions } = require('../util/prompt');

// Get the optional script `project` argument, and lint the project source code.
getOptionalArg('project')
  .then(lintProject)
  .catch(console.error)
  .finally(process.exit);

/**
 * Lints the source code for a given project.
 * @param {string} project The name of the project that shall be linted.
 * @return {Promise<void>} A promise that resolves once the lint operation completes.
 */
async function lintProject(project) {
  if (!project) {
    project = await selectProjectPrompt(true);
  }
  env(project); // Be sure to init utilized .env based on selected project.

  if (project === 'all') {
    for (projectOpt of projectOptions) {
      await spawnLinter(projectOpt)
    }
  } else {
    await spawnLinter(project);
  }
}

/**
 * Spawns a linter sub-process for a given node project.
 * @param {string} project The project that shall be linted.
 * @return {Promise<void>} A promise that resolves once the linter sub-process completes.
 */
async function spawnLinter(project) {
  const isWeb = (project === 'web');
  const projectDir = (isWeb ? global['serverWebDir'] : global['serverAdminDir']);
  const tsconfigPathname = path.join(projectDir, 'tsconfig.json');
  await spawn('tslint', ['-p', tsconfigPathname]);
}
