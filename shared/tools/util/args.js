const yargs = require('yargs');

/**
 * Gets a single required script argument with a given argument name.
 * Also, sets the default command `--help` text based off of the given argument name.
 * @param {string} argName The name of the required script argument.
 */
async function getArg(argName) {
  return new Promise((res) => {
    yargs.command(`$0 <${argName}>`, 'The default command', () => {},
      (argResult) => res(
        argResult[argName] ? argResult[argName]
                           : defaultValue
      )
    ).argv;
  });
}

/**
 * Gets a single optional script argument with a given argument name.
 * Also, sets the default command `--help` text based off of the given argument name.
 * @param {string} argName The name of the optional script argument.
 * @param {string} defaultValue The default value for the script argument if it is not supplied (defaults to '').
 */
async function getOptionalArg(argName, defaultValue = '') {
  return new Promise((res) => {
    yargs.command(`$0 [${argName}]`, 'The default command', () => {},
      (argResult) => res(
        argResult[argName] ? argResult[argName]
                           : defaultValue
      )
    ).argv;
  });
}

module.exports = {
  getArg,
  getOptionalArg
};
