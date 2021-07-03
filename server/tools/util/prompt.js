require('./constants');
const { getFileChoices, inputPrompt, selectPrompt } = require('../../../shared/tools/util/prompt');
const { getProjects } = require('./project');

const projectOptions = ['web', 'admin'];

/**
 * Generates a select prompt in stdin, which allows the user to select a node project.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all projects. Defaults to false.
 * @return {Promise<string>} A promise that resolves to the selected node project.
 */
async function selectProjectPrompt(includeAll = false) {
  return selectPrompt('Select a project', await getProjects(includeAll));
}

module.exports = {
  getFileChoices,
  inputPrompt,
  projectOptions,
  selectProjectPrompt,
  selectPrompt
};
