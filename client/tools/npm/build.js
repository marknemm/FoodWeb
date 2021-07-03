require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { getProjects, parseProjectInput, selectProjectPrompt } = require('../util/project');
const { getPlatforms, selectPlatformPrompt } = require('../util/platform');

const builtProjects = new Map();

// Get the optional script `project` argument, and build the project source.
getOptionalArg('project')
  .then(parseProjectInput)
  .then((inputData) => buildProject(inputData.project, inputData.platform))
  .catch(console.error)
  .finally(process.exit);

/**
 * Builds the source code for a given client project.
 * @param {string} project The name of the client project that shall be built.
 * @param {string} platform The device platform for which to build the client project.
 * @return {Promise<void>} A promise that resolves once the build operation completes.
 */
async function buildProject(project, platform) {
  if (!project) {
    project = await selectProjectPrompt(true);
  }

  if (project.indexOf('hybrid') >= 0 && !platform) {
    platform = await selectPlatformPrompt(true);
  }

  const buildProjects = (project === 'all')
    ? getProjects()
    : [project];

  for (const buildProject of buildProjects) {
    let buildPlatforms = ['web'];
    if (buildProject.indexOf('hybrid') >= 0) {
      buildPlatforms = (project === 'all' || platform === 'all')
        ? getPlatforms()
        : [platform ? platform : 'web'];
    }

    for (const buildPlatform of buildPlatforms) {
      await buildOneProject(buildProject, buildPlatform);
    }
  }
}

/**
 * Builds a single client project.
 * @param {string} project The client project to build.
 * @param {string} platform The platform for which to build the client project.
 * @return {Promise<void>} A promise that resolves once the build operation completes.
 */
async function buildOneProject(project, platform) {
  if (!builtProjects.has(project)) { // Do not rebuild same project for multiple platforms.
    await spawn('ng', ['build', '--prod', `--project=${project}`]);
    builtProjects.set(project, true);
  }
  if (platform && platform !== 'web') {
    await spawn('npx', ['nx', 'run', `${project}:sync:${platform}`]);
  }
}
