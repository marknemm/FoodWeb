require('../../util/env')();
const commandExists = require('command-exists');
const exec = require('../../../../shared/tools/util/exec');
const path = require('path');
const { promises: fs } = require('fs');
const { getDbConfig } = require('./client');
const { getOptionalArg } = require('../../../../shared/tools/util/args');
const { inputPrompt } = require('../../util/prompt');

// Get the optional script `dumpFileName` argument, and run pg dump.
getOptionalArg('dumpFileName')
  .then(pgDump)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Runs pg dump and outputs the result to a given dump file name. If the dump file name is not provided,
 * then prompts the user for the dump file name.
 * @param {string} dumpFileName The name of the dump file to write to.
 * @return {Promise<void>} A promise that resolves once the dump operation completes.
 */
async function pgDump(dumpFileName) {
  if (!dumpFileName) {
    dumpFileName = await inputPrompt('Enter the dump file name [default]', 'default');
  }
  dumpFileName = dumpFileName.replace(/\..*$/, ''); // Ensure it doesn't have a file type.

  // Perform development database dump (check if we should be using local or docker database).
  const dumpDir = await getCreateDumpDir();
  const clientConfig = await getDbConfig();

  // Run dump SQL. First see if the pg_dump command is available on localhost. If not, try to run it inside the postgres docker container.
  console.log(`Dumping dev database to file: ${dumpFileName}`);
  const pgDumpCmd = `pg_dump --clean --if-exists --column-inserts --attribute-inserts -h ${clientConfig.host} -U ${clientConfig.user} -d ${clientConfig.database}`;
  try {
    await commandExists('pg_dump');
    await exec(`${pgDumpCmd} > "${path.join(dumpDir, `${dumpFileName}.pgsql`)}"`);
  } catch (err) {
    await exec(`docker exec postgres bash -c "${pgDumpCmd} > '/var/lib/postgresql/dump/${dumpFileName}.pgsql'"`);
  }
}

/**
 * Gets the dump directory path. Creates the directory if it does not exist.
 * @return {Promise<string>} A promise that resolves to the path of the dump directory.
 */
async function getCreateDumpDir() {
  const dumpDir = global['sqlDumpDir'];
  await fs.stat(dumpDir).catch(async () =>
    await fs.mkdir(dumpDir)
  );
  return dumpDir;
}
