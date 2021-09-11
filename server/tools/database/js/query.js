require('../../util/env')();
const { getOptionalArg } = require('../../../../shared/tools/util/args');
const { inputPrompt } = require('../../util/prompt');
const { connect } = require('./client');

// Get the optional script `sql` argument, and run pg exec.
getOptionalArg('sql')
  .then(pgQuery)
  .then(process.exit)
  .catch((err) => { console.error(err); process.exit(1); });

/**
 * Executes a given single-line SQL statement or file.
 * @param {string} sql The SQL string that will be executed.
 * May also be the pathname of a SQL file to execute (must end in either .sql or .pgsql).
 * If falsy, then the user will be prompted for a SQL statement.
 * @return {Promise<void>} A promise that resolves once the initialization is complete.
 */
async function pgQuery(sql) {
  const client = await connect();

  // Prompt the user for the SQL statement if not given as a script argument.
  if (!sql) {
    sql = await inputPrompt('SQL');
  }

  // Run SQL file if given a file name, or run query if not blank.
  let queryResult = null;
  if (/\.(pg)?sql$/i.test(sql)) {
    console.log(`Executing SQL file: ${sql}`);
    queryResult = await client.execFile(sql, true);
    console.log('Completed SQL execution');
  } else if (sql) {
    console.log(`Executing SQL query: ${sql}`);
    queryResult = await client.query(sql);
    console.log('Completed SQL query');
  }

  if (queryResult) {
    console.log(`Result count: ${queryResult.rowCount}`);
    console.log(queryResult.rows);
  }
}
