require('../util/constants');
const spawn = require('../../../shared/tools/util/spawn');
const path = require('path');
const yargs = require('yargs');
const { writeFileSync } = require('fs');
const { getProjects, parseProjectInput, selectProjectPrompt } = require('../util/project');
const { getPlatforms, selectPlatformPrompt } = require('../util/platform');

const builtProjects = new Map();

// Parse command line arguments.
const args = yargs.command(`$0 [project] [Options]`, 'Builds given Ng project(s).',
  (yargs) =>
    yargs.positional('Project', {
      description: 'The Ng project to build. If not provided, then prompted.',
      type: 'string'
    })
    .option('configuration', {
      alias: 'c',
      description: 'The Ng config to use when building the project.',
      default: 'production'
    })
  ).argv;
const projectData = parseProjectInput(args.project);

// Build the project source.
buildProject(projectData.project, projectData.platform)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

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
      await buildOneProject(buildProject, buildPlatform, args.configuration);
    }
  }
}

/**
 * Builds a single client project.
 * @param {string} project The client project to build.
 * @param {string} platform The platform for which to build the client project.
 * @param {string} configuration The Ng config or env to use when building the project.
 * @return {Promise<void>} A promise that resolves once the build operation completes.
 */
async function buildOneProject(project, platform, configuration) {
  if (!builtProjects.has(project)) { // Do not rebuild same project for multiple platforms.
    await spawn('ng', ['build', `--project=${project}`, `-c=${configuration}`]);
    builtProjects.set(project, true);
  }
  if (platform && platform !== 'web') {
    await spawn('npx', ['nx', 'run', `${project}:sync:${platform}`]);

    if (platform === 'ios') {
      setIosServerPathname(); // Ensure we fix cross-domain cookie limitation on ios VKWebView.
    }
  }
}

/**
 * Sets the server pathname for ios builds within the capacitor.config.json file.
 * Necessary to fix a bug where cookies are not shared between domains in VKWebView used by ios.
 * See: https://github.com/ionic-team/capacitor/issues/1373#issuecomment-707822708
 *
 * `Note`: Cannot be applied to Android, since setting the server hostname will cause android to make local requests
 * when JSON api calls are issued to get data from the server specified by hostname.
 */
function setIosServerPathname() {
  const capacitorPathname = path.join(global['clientProjectsDir'], 'hybrid', 'ios', 'App', 'App', 'capacitor.config.json');
  const capacitorConfig = require(capacitorPathname);
  capacitorConfig.server = capacitorConfig.server ?? {};
  capacitorConfig.server.hostname = 'www.wnyfoodweb.com';
  writeFileSync(capacitorPathname, JSON.stringify(capacitorConfig, null, 2));
}
