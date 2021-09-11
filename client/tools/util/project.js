require('./constants');
const angular = require('../../angular.json');
const path = require('path');
const { selectPrompt } = require('../../../shared/tools/util/prompt');

/**
 * Gets the directory of a given project.
 * @param {string} project The project to get the directory of.
 * @returns {string} The project directory.
 */
function getProjectDir(project) {
  return path.join(global['clientProjectsDir'], project);
}

/**
 * Gets the port associated with a given project.
 * @param {string} project The project name.
 * @returns {number} The project's port number.
 */
function getProjectPort(project) {
  const projectIdx = getProjects().findIndex(
    (proj) => project.startsWith(proj)
  );
  return (4200 + projectIdx);
}

/**
 * Gets a list of the client project names.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all projects. Defaults to false.
 * @param {string[]} exclude A list of project names to exclude. Defaults to an empty list.
 * @returns {string[]} A list of the client project names.
 */
function getProjects(includeAll = false, exclude = []) {
  const projectNames = Object.keys(angular.projects)
    .filter((projectName) => exclude.indexOf(projectName) < 0);

  // If web is found within the projects list, move it to the first (default) index.
  const webProjectIdx = projectNames.indexOf('web');
  if (webProjectIdx > 0) {
    projectNames.splice(webProjectIdx, 1);
    projectNames.unshift('web');
  }

  // Return the project names, and prepend 'all' if configured.
  return (includeAll ? ['all'] : []).concat(projectNames);
}

/**
 * Parses given project CLI input by splitting up project & platform segments separated by ':'.
 * @param {string} project The project CLI input to parse.
 * @returns {{ project: string, platform: string }} The project CLI input parse result containing separate project & platform fields.
 */
function parseProjectInput(project) {
  let platform = '';
  if (project && project.indexOf(':') > 0) {
    const projectPlatformSplit = project.split(':');
    project = projectPlatformSplit[0];
    platform = projectPlatformSplit[1];
  }
  return { project, platform };
}

/**
 * Generates a select prompt in stdin, which allows the user to select a client project.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all projects. Defaults to false.
 * @param {string[]} exclude A list of projects to exclude from the prompt.
 * @return {Promise<string>} A promise that resolves to the selected client project.
 */
async function selectProjectPrompt(includeAll = false, exclude = []) {
  return selectPrompt('Select a project', getProjects(includeAll, exclude));
}

module.exports = {
  getProjectDir,
  getProjectPort,
  getProjects,
  parseProjectInput,
  selectProjectPrompt
};
