require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const yargs = require('yargs');
const { getProjectDir, getProjectPort, parseProjectInput, selectProjectPrompt } = require('../util/project');
const { selectPlatformPrompt } = require('../util/platform');

// Parse command line arguments.
const args = yargs.command(`$0 [project] [Options]`, 'Runs a client Ng project on a lightweight dev server.',
  (yargs) =>
    yargs.positional('project', {
      description: 'The Ng project to run. If not provided, then prompted.',
      type: 'string'
    })
    .option('configuration', {
      alias: 'c',
      description: 'The Ng config to use when running the dev server.',
      default: ''
    })
  ).argv;
const projectData = parseProjectInput(args.project);

// Start the node server.
startClient(projectData.project, projectData.platform)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Runs a given client project on a lightweight Angular server. If the provided `project` is falsy, then prompts the user for the project.
 * @param {string} project The name of the client project that shall be run.
 * @param {string} platform The device platform for which to start the client web server.
 * @return {Promise<void>} A promise that resolves once the client terminates.
 */
async function startClient(project, platform) {
  if (!project) {
    project = await selectProjectPrompt();
  }
  const port = getProjectPort(project);

  if (project.indexOf('hybrid') >= 0 && !platform) {
    platform = await selectPlatformPrompt();
  }

  const configOpts = args.configuration
    ? ['-c', args.configuration]
    : [];

  (platform && platform !== 'web')
    ? await spawn('npx', ['ionic', 'cap', 'run', platform, `--project=${project}`, '-livereload', '--external', '--source-map=false', '--consolelogs', '--serverlogs'].concat(configOpts),
                  '', getProjectDir(project))
    : await spawn('ng', ['serve', `--port=${port}`, `--project=${project}`, '--host=127.0.0.1'].concat(configOpts));
}
