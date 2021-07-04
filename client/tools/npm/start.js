require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const yargs = require('yargs');
const { getProjectDir, parseProjectInput, selectProjectPrompt } = require('../util/project');
const { selectPlatformPrompt, extractPlatform } = require('../util/platform');

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
  .catch(console.error)
  .finally(process.exit);

/**
 * Runs a given client project on a lightweight Angular server. If the provided `project` is falsey, then prompts the user for the project.
 * @param {string} project The name of the client project that shall be run.
 * @param {string} platform The device platform for which to start the client web server.
 * @return {Promise<void>} A promise that resolves once the client terminates.
 */
async function startClient(project, platform) {
  if (!project) {
    project = await selectProjectPrompt();
  }

  if (project.indexOf('hybrid') >= 0 && !platform) {
    platform = await selectPlatformPrompt();
  }

  const configOpts = args.configuration
    ? ['-c', args.configuration]
    : [];

  (platform && platform !== 'web')
    ? await spawn('npx', ['ionic', 'cap', 'run', platform, `--project=${project}`, '-l', '--external', '--source-map', '--consolelogs', '--serverlogs'].concat(configOpts),
                  '', getProjectDir(project))
    : await spawn('ng', ['serve', `--project=${project}`].concat(configOpts));
}
