require('../../util/env')();
const { Client, ClientConfig, QueryResult } = require('pg');
const { promises: fs } = require('fs');
const { getHost } = require('../../util/host');

/**
 * A FoodWeb PostgreSQL Client that configures its own credentials based off of the web project's .env settings.
 * @extends Client
 */
class PgClient extends Client {
  /**
   * Executes a given SQL file.
   * @param {string} pathname The pathname of the SQL file to execute.
   * @param {boolean} printSQL Set to true to print the SQL before executing it. Defaults to false.
   * @return {Promise<QueryResult<any>>} A promise that resolves to the result of the execution.
   */
  async execFile(pathname, printSQL = false) {
    const sql = await fs.readFile(pathname, 'utf-8');
    if (printSQL) {
      console.log(sql);
    }
    return this.query(sql);
  }
}

/**
 * The singleton client.
 * @type PgClient
 */
let client = null;

/**
 * Creates a singleton Client using the server web project's .env settings, and initializes a connection to the database.
 * As long as the resolved client has not been ended, repeated calls will resolve to the same client.
 * @return {Promise<PgClient>} A promise that resolves to the connected client.
 */
async function connect() {
  if (!client) {
    const config = await getDbConfig();
    client = new PgClient(config);
    await client.connect();
    client.on('end', () => client = null);
  }
  return client;
}

/**
 * Gets the FoodWeb development database client configruation based on the server web project's .env settings.
 * @return {Promise<ClientConfig>} A promise that resolves to the database client configuration.
 */
async function getDbConfig() {
  const port = process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432;

  // Attempt to determine the host that should be used. If no env host, localhost, or postgres (docker hostname), then
  // try to determine if this script is running on localhost or docker. Otherwise, if custom host, then just use it.
  const envHost = process.env.DATABASE_HOST;
  const host = (!envHost || ['localhost', '127.0.0.1', 'postgres'].indexOf(envHost) >= 0)
    ? await getHost(port, 'postgres')
    : process.env.DATABASE_HOST;

  return {
    host,
    port,
    database: process.env.DATABASE_DATABASE,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: (process.env.DATABASE_SSL === 'true')
  }
}

module.exports = {
  PgClient,
  connect,
  getDbConfig
};
