require('./constants');
const { selectPrompt } = require('../../../shared/tools/util/prompt');

/**
 * Gets a list of the client platform names.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all platforms. Defaults to false.
 * @param {string[]} exclude A list of platform names to exclude. Defaults to an empty list.
 * @returns {string[]} A list of the client platform names.
 */
 function getPlatforms(includeAll = false, exclude = []) {
  const platformNames = ['android', 'ios', 'web']
    .filter((platformName) => exclude.indexOf(platformName));

  // Return the platform names, and prepend 'all' if configured.
  return (includeAll ? ['all'] : []).concat(platformNames);
}

/**
 * Generates a select prompt in stdin, which allows the user to select a client platform.
 * @param {boolean} includeAll Whether or not to include an 'all' selection for all platforms. Defaults to false.
 * @param {string[]} exclude A list of the platforms to exclude from the prompt.
 * @return {Promise<string>} A promise that resolves to the selected client platform.
 */
async function selectPlatformPrompt(includeAll = false, exclude = []) {
  return selectPrompt('Select a device platform', getPlatforms(includeAll, exclude));
}

module.exports = {
  getPlatforms,
  selectPlatformPrompt
};
