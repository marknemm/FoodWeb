require('../../util/env')();
const path = require('path');
const { getOptionalArg } = require('../../util/args');
const { PgClient, connect } = require('./client');

// Get absolute pathname to SQL util scripts used to initialize the dev DB.
const accountExistsPathname          = path.join(global['sqlScriptsDir'], 'account-exists.pgsql');
const accountCntPathname             = path.join(global['sqlScriptsDir'], 'account-count.pgsql');
const initPathname                   = path.join(global['sqlScriptsDir'], 'dev-db-init.pgsql');
const makeTimestampsRelevantPathname = path.join(global['sqlScriptsDir'], 'make-timestamps-relevant.pgsql');

// Get the optional script `force` argument, and run pg initialize.
getOptionalArg('force')
  .then(pgInitialize)
  .catch(console.error)
  .finally(process.exit);

/**
 * Initialize the database schema, and fille the database with test entries that have relevant timestamps.
 * Will skip initialization if the database has already been initialized.
 * @param {boolean} force Whether or not to force (re)initialization if the database has already been initialized.
 * @return {Promise<void>} A promise that resolves once the initialization is complete.
 */
async function pgInitialize(force) {
  // Perform development database initialization if not forcing reinitialization or not already initialized.
  const client = await connect();
  console.log(force);
  if (!force && await alreadyInitialized(client)) {
    return console.log('Skipping database initialization since it has already been initialized.');
  }

  // Init database schema and test/mock data.
  console.log('Initiailizing database...');
  await client.execFile(initPathname);
  console.log('Database initialization complete');

  // Make database timestamps relevant.
  console.log('Making database timestamps relevant...');
  await client.execFile(makeTimestampsRelevantPathname);
  console.log('Database timestamps are now relevant');
}

/**
 * Checks if the database has already been initialized.
 * @param {PgClient} client The PostgreSQL client.
 * @return {Promise<boolean>} A promise that resolves to true if the database has already been initialized, false if not.
 */
async function alreadyInitialized(client) {
  // Check to see if Account table exists.
  const accountExistsResult = await client.execFile(accountExistsPathname);
  const accountExists = accountExistsResult.rows[0].exists;

  // Check to see if the Account table has any entries.
  let accountCnt = 0;
  if (accountExists) {
    const accountCntResult = await client.execFile(accountCntPathname);
    accountCnt = accountCntResult.rows[0].count;
  }

  return (accountCnt > 0);
}
