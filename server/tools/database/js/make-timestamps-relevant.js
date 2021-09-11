require('../../util/env')();
const path = require('path');
const { connect } = require('./client');

pgMakeTimestampsRelevant()
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Runs a SQL script that makes all timestamps within the database relevant to the current time.
 * @return {Promise<void>} A promise that resolves once the script is complete.
 */
async function pgMakeTimestampsRelevant() {
  const client = await connect();
  const makeTimestampsRelevantPathname = path.join(global['sqlScriptsDir'], 'make-timestamps-relevant.pgsql');

  // Make database timestamps relevant.
  console.log('Making database timestamps relevant...');
  await client.execFile(makeTimestampsRelevantPathname);
  console.log('Database timestamps are now relevant');
}
