/* Restores the schema and contents of the development database from a dump file.
 * Takes a single command line argument, which is the name of the dump file. */

const { execSync } = require('child_process');
const path = require('path');

// Ensure we have a proper dump file name.
let dumpFileName = process.argv[2];
if (!dumpFileName) {
  dumpFileName = 'default';
}
dumpFileName = dumpFileName.replace(/\..*$/, ''); // Ensure it doesn't have a file type.

// Get absolute pathname to target restore dump file.
const dumpDir = path.join(__dirname, '..', 'dump');
const dumpPathname = path.join(dumpDir, `${dumpFileName}.pgsql`);

// Perform development database dump.
const pgExecScript = path.join(__dirname, 'pg-exec.js');
const execResult = execSync(`node ${pgExecScript} -f "${dumpPathname}"`);
console.log(execResult.toString());
