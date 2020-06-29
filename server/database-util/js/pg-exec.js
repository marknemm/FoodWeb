// Executes a psql CLI command. Takes a single argument, which is a string containing the combined args for the psql command.

const { execSync } = require('child_process');
const isPortReachable = require('is-port-reachable');

// Grab input postgresql execution arguments.
const psqlArgStr = process.argv.slice(2).join(' ');

// Setup database connection info.
const user = 'postgres';
const database = 'foodweb';
process.env['PGPASSWORD'] = 'foodweb';

// Perform development database exec (check if we should be using local or docker database).
(async () => {
  let execResult;
  if (await isPortReachable(5432)) { // Try local.
    execResult = execSync(`psql -U ${user} -d ${database} ${psqlArgStr}`);
  } else if(await isPortReachable(5432, { host: 'postgres' })) { // Try docker.
    execResult = execSync(`psql -h postgres -U ${user} -d ${database} ${psqlArgStr}`);
  } else { // Give up.
    console.error('Could not connect to a development PostgreSQL instance.');
    process.exit(1);
  }
  console.log(execResult.toString());
})();
