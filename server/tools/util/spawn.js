const commandExists = require('command-exists');
const _spawn = require('child_process').spawn;

/**
 * Runs a given command within a child process, and pipes all log in/output to this process's logs.
 * @param {string} cmd The command that is to be run in the child process.
 * @param {string[]} args A list of the arguments to the given command.
 * @param {string} startFinishTxt Optional text that will be appended to 'Starting ' & 'Finished ' log output.
 * @return {Promise<void>} A promise that resolves once the child process exits successfully.
 */
async function spawn(cmd, args, startFinishTxt = '') {
  cmd = await ensureCmdExists(cmd);
  if (startFinishTxt) {
    console.log(`Starting ${startFinishTxt}`);
  }
  console.log(`${cmd} ${args.join(' ')}`);
  const childProcess = _spawn(cmd, args, { stdio: 'inherit' });
  return new Promise((res, rej) =>
    childProcess.on('exit', (code) => {
      if (startFinishTxt) {
        console.log(`Finished ${startFinishTxt}`);
      }
      return (code === 0) ? res()
                          : rej(`Process exited with code '${code}'`);
    })
  );
}

/**
 * Ensures that a given command exists.
 * @param {string} cmd The command to check.
 * @return {string} The command if it exists. If on Windows, may modify the command by appending '.cmd'.
 */
async function ensureCmdExists(cmd) {
  try {
    await commandExists(`${cmd}.cmd`);
    cmd += '.cmd';
  } catch (err) {
    await commandExists(cmd);
  }
  return cmd;
}

module.exports = spawn;
