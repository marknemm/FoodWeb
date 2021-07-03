require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { getProjects, selectProjectPrompt } = require('../util/project');

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

  if (project === 'all') {
    for (projectOpt of getProjects()) {
      await spawn('npx', ['nx', 'run', `${projectOpt}:lint`]);
    }
  } else {
    await spawn('npx', ['nx', 'run', `${project}:lint`]);
  }
}
