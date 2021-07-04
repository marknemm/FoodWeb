require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const yargs = require('yargs');
const { getProjects, selectProjectPrompt } = require('../util/project');

// Parse command line arguments.
const args = yargs.command(`$0 [project]`, 'Lints a client Ng project.',
  (yargs) =>
    yargs.positional('project', {
      description: 'The Ng project to lint. If not provided, then prompted.',
      type: 'string'
    })
  ).argv;

// Lint the project source code.
lintProject(args.project)
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
