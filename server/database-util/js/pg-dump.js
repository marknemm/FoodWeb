/* Dumps the schema and contents of the development database into an output pgsql file within the ./dump directory.
 * Takes a single command line argument, which is the name of the dump file. */

const { execSync } = require('child_process');
const fs = require('fs');
const isPortReachable = require('is-port-reachable');
const path = require('path');

// Ensure we have a proper dump file name.
let dumpFileName = process.argv[2];
if (!dumpFileName) {
  dumpFileName = 'default';
}
dumpFileName = dumpFileName.replace(/\..*$/, ''); // Ensure it doesn't have a file type.

// Ensure dump directory exists & generate dump file pathname with it.
const dumpDir = path.join(__dirname, '..', 'dump');
if (!fs.existsSync(dumpDir)) {
  fs.mkdirSync(dumpDir);
}
const dumpPathname = path.join(dumpDir, `${dumpFileName}.pgsql`);

// Setup database connection info.
const user = 'postgres';
const database = 'foodweb';
process.env['PGPASSWORD'] = 'foodweb';

// Perform development database dump (check if we should be using local or docker database).
(async () => {
  let execResult;
  if (await isPortReachable(5432)) { // Try local.
    execResult = execSync(`pg_dump -U ${user} -d ${database} > "${dumpPathname}"`);
  } else if(await isPortReachable(5432, { host: 'postgres' })) { // Try docker.
    execResult = execSync(`pg_dump -h postgres -U ${user} -d ${database} > "${dumpPathname}"`);
  } else { // Give up.
    console.error('Could not connect to a development PostgreSQL instance.');
    process.exit(1);
  }
  console.log(execResult.toString());
})();
