const _exec = require('child_process').exec;

/**
 * Runs a given command within a child process, and pipes all log in/output to this process's logs.
 * @param {string} cmd The command that is to be run in the child process.
 * @param {string} startFinishTxt Optional text that will be appended to 'Starting ' & 'Finished ' log output.
 * @return {Promise<void>} A promise that resolves once the child process exits successfully.
 */
async function exec(cmd, startFinishTxt = '') {
  if (startFinishTxt) {
    console.log(`Starting ${startFinishTxt}`);
  }
  console.log(cmd);
  const childProcess = _exec(cmd);
  process.stdin.pipe(childProcess.stdin);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
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

module.exports = exec;
