require('../util/env')();
const spawn = require('../../../shared/tools/util/spawn');
const path = require('path');
const { getOptionalArg } = require('../../../shared/tools/util/args');
const { getFileChoices, selectPrompt } = require('../util/prompt');

// Get the optional script `command` argument, and run the pg command.
getOptionalArg('command')
  .then((command) => runPg(command, process.argv.slice(3).join(' ')))
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Runs a given pg command. If the command is falsy, then prompts the user for the command first.
 * @param {string} command The pg command that shall be run.
 * @return {Promise<void>} A promise that resolves once the command completes.
 */
async function runPg(command, args) {
  // If command not specified as script arg, then prompt user to select from available database tools JS scripts.
  if (!command) {
    const commandChoices = await getCommandChoices();
    command = await selectPrompt('Select a command', commandChoices);
  }
  command = command.replace(/\..*$/, ''); // Ensure it doesn't have a file type.

  // Get node command JS file pathname and any related arguments to the script.
  const commandPathname = path.join(global['databaseToolsJsDir'], `${command}.js`);
  if (command === 'initialize') {
    args = 'true'; // Force re-initialization.
  } else if (!args) {
    args = ''; // Make sure extra args is an empty string if falsy.
  }

  return spawn('node', [commandPathname].concat(args.split(' ')), `command: ${command}`);
}

/**
 * Gets the available pg (database) command choices based off of the database tools JS scripts.
 * @return {Promise<string[]>} A promise that resolves to the available pg command choices.
 */
async function getCommandChoices() {
  const commandChoices = await getFileChoices(global['databaseToolsJsDir']);
  const pgClientIdx = commandChoices.indexOf('client');
  if (pgClientIdx >= 0) {
    commandChoices.splice(pgClientIdx, 1);
  }
  return commandChoices;
}
