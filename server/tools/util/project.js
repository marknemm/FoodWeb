const { promises: fs } = require('fs');
const path = require('path');

/**
 * Gets the directory of a given project.
 * @param {string} project The project to get the directory of.
 * @returns {string} The project directory.
 */
 function getProjectDir(project) {
  return path.join(global['serverProjectsDir'], project);
}

/**
 * Gets a list of the server project names.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all projects. Defaults to false.
 * @param {string[]} exlcude A list of project names to exclude. Defaults to an empty list.
 * @returns {Promise<string[]>} A promise that resolves to a list of the server project names.
 */
async function getProjects(includeAll = false, exlcude = []) {
  // Get all dirents (files & directories) under the server projects directory.
  const projectsDirents = await fs.readdir(
    global['serverProjectsDir'],
    { withFileTypes: true }
  );

  // Filter out dirents that are not directories or that are found in the given exclude list, and map to names.
  const projectNames = projectsDirents
    .filter((dirent) => dirent.isDirectory() && exlcude.indexOf(dirent.name) < 0)
    .map((dirent) => dirent.name);

  // If web is found within the projects list, move it to the first (default) index.
  const webProjectIdx = projectNames.indexOf('web');
  if (webProjectIdx > 0) {
    projectNames.splice(webProjectIdx, 1);
    projectNames.unshift('web');
  }

  // Return the project names, and prepend 'all' if configured.
  return (includeAll ? ['all'] : []).concat(projectNames);
}

module.exports = {
  getProjectDir,
  getProjects
};
