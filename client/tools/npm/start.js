require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { getProjectDir, parseProjectInput, selectProjectPrompt } = require('../util/project');
const { selectPlatformPrompt, extractPlatform } = require('../util/platform');

// Get the optional script `project` argument, and start the node server.
getOptionalArg('project')
  .then(parseProjectInput)
  .then((inputData) => startClient(inputData.project, inputData.platform))
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

  (platform && platform !== 'web')
    ? await spawn('npx', ['ionic', 'cap', 'run', platform, `--project=${project}`, '-l', '--external', '--source-map', '--consolelogs'],
                  '', getProjectDir(project))
    : await spawn('ng', ['serve', `--project=${project}`]);
}
