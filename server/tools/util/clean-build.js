const path = require('path');
const spawn = require('./spawn');

/**
 * Cleans the build artifacts for a given server project.
 * @param {string} project The project to clean the build artifacts for.
 * @return {Promise<void>} A promise that resolves once the clean operation completes.
 */
async function cleanBuild(project = 'web') {
  // If not web project, then clean artifacts related to specific project.
  if (project !== 'web') {
    await spawn('rimraf', [path.join(global['serverDistDir'], 'server', 'projects', project)]);
    await spawn('rimraf', [path.join(global['serverDistDir'], 'shared', 'src', project)]);
  }

  // Always clean web project artifacts since it acts as a base for all other projects.
  await spawn('rimraf', [path.join(global['serverDistDir'], 'server', 'projects', project)]);
  await spawn('rimraf', [path.join(global['serverDistDir'], 'server', 'templates')]);
  await spawn('rimraf', [path.join(global['serverDistDir'], 'shared', 'src', project)]);
}

module.exports = cleanBuild;
