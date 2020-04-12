/* Initializes the schema and contents of the development database from a SQL script if not already initialized. */

const { execSync } = require('child_process');
const path = require('path');

// Get absolute pathname to SQL util scripts used to initialize the dev DB.
const sqlUtilPath = path.join(__dirname, '..', 'sql');
const accountExistsPathname = path.join(sqlUtilPath, 'account-exists.pgsql');
const accountCntPathname = path.join(sqlUtilPath, 'account-count.pgsql');
const initPathname = path.join(sqlUtilPath, 'dev-db-init.pgsql');
const makeTimestampsRelevantPathname = path.join(sqlUtilPath, 'make-timestamps-relevant.pgsql');

let execResult;
const pgExecScript = path.join(__dirname, 'pg-exec.js');

// Check to see if the Account table exists.
execResult = execSync(`node ${pgExecScript} -f ${accountExistsPathname}`);
const accountExists = execResult.toString().indexOf('true') >= 0;

// Check to see if the Account table has any entries.
let accountCnt = 0;
if (accountExists) {
  execResult = execSync(`node ${pgExecScript} -f ${accountCntPathname}`);
  accountCnt = Number.parseInt(execResult.toString().split('\n')[2]);
}

// Perform development database initialization if not already initialized.
if (accountCnt === 0) {
  execResult = execSync(`node ${pgExecScript} -f ${initPathname}`);
  console.log(execResult.toString());
  execResult = execSync(`node ${pgExecScript} -f ${makeTimestampsRelevantPathname}`);
  console.log(execResult.toString());
}
