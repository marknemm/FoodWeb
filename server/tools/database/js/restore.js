require('../../util/env')();
const path = require('path');
const { getOptionalArg } = require('../../../../shared/tools/util/args');
const { getFileChoices, selectPrompt } = require('../../util/prompt');
const { connect } = require('./client');

// Get the optional script `dumpFileName` argument, and run pg restore.
getOptionalArg('dumpFileName')
  .then(pgRestore)
  .catch(console.error)
  .finally(process.exit);

/**
 * Restores the database with a given dump file.
 * @param {string} dumpFileName The name of the dump file.
 * @return {Promise<void>} A promise that resolves once the restore operation completes.
 */
async function pgRestore(dumpFileName) {
  const client = await connect();

  if (!dumpFileName) {
    const dumpFileChoices = await getFileChoices(global['sqlDumpDir']);
    dumpFileName = await selectPrompt('Select a dump file to restore from', dumpFileChoices);
  }

  // Get dump file pathname.
  dumpFileName = dumpFileName.replace(/\..*$/, ''); // Ensure it doesn't have a file type.
  const dumpPathname = path.join(global['sqlDumpDir'], `${dumpFileName}.pgsql`);

  // Restore the database with the given dump file.
  console.log(`Restoring database with dump file '${dumpFileName}'...`);
  await client.execFile(dumpPathname);
  console.log('Finished restoring database');
}
