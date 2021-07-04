require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const yargs = require('yargs');
const { parseProjectInput } = require('../util/project');
const { selectPlatformPrompt } = require('../util/platform');

// Parse command line arguments.
const args = yargs.command(`$0 [project]`, 'Lints a client Ng project.',
  (yargs) =>
    yargs.positional('project', {
      description: 'The Ng project to lint. If not provided, then prompted.',
      type: 'string'
    })
  ).argv;
const projectData = parseProjectInput(args.project);

// Open the project in the native platform's official IDE (Android Studio or XCode).
openNative(projectData.project, projectData.platform)
  .catch(console.error)
  .finally(process.exit);

/**
 * Opens a given hybrid project's platform project within the associated official IDE for that platform.
 * @param {string} project The name of the project that shall be opened.
 * @param {string} platform The platform for which to open the offical IDE.
 * @return {Promise<void>} A promise that resolves once the open operation completes.
 */
async function openNative(project, platform) {
  project = project ? project : 'hybrid';

  if (!platform) {
    platform = await selectPlatformPrompt(false, ['web']);
  }

  await spawn('npx', ['nx', 'run', `${project}:open:${platform}`]);
}
