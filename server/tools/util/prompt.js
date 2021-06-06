require('./constants');
const prompts = require('prompts');
const { getProjects } = require('./project');
const { promises: fs } = require('fs');

const projectOptions = ['web', 'admin'];

/**
 * Gets the file (name) choices under a given directory.
 * @param {string} dirName The name of the directory that the file choices are under.
 * @param {string} excludeFiles A list of the names of files to exclude (must not have extensions).
 * @return {Promise<string[]>} A promise that resolves to the retrieved file name choices (with no paths or extensions).
 */
async function getFileChoices(dirName, excludeFiles = []) {
  return fs.readdir(dirName)
    .then((files) => files
      .map((file) => file.replace(/\..*$/, ''))
      .filter((file) => excludeFiles.indexOf(file) < 0)
    );
}

/**
 * Generates an input prompt in stdin.
 * @param {string} message The imput prompt main message/question.
 * @param {string} defaultValue An optional default value that shall be set when the user inputs an empty string.
 * @return {Promise<string>} A promise that resolves to the user input value.
 */
async function inputPrompt(message, defaultValue = '') {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message
  });
  return (response.value) ? response.value
                          : defaultValue;
}

/**
 * Generates a select prompt in stdin, which allows the user to select a node project.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all projects. Defaults to false.
 * @return {Promise<string>} A promise that resolves to the selected node project.
 */
async function selectProjectPrompt(includeAll = false) {
  return selectPrompt('Select a project', await getProjects(includeAll));
}

/**
 * Generates a select prompt in stdin.
 * @param {string} message The select prompt main message/question.
 * @param {string[]} choices A list of choices to select from.
 * @return {Promise<string>} A promise that resolves to the user selected choice.
 */
async function selectPrompt(message, choices) {
  const response = await prompts({
    type: 'select',
    name: 'choice',
    message,
    choices: choices.map(
      (choice) => ({ title: choice, value: choice })
    )
  });
  return response.choice;
}

module.exports = {
  getFileChoices,
  inputPrompt,
  projectOptions,
  selectProjectPrompt,
  selectPrompt
};
