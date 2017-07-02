var pg = require('pg');
require('dotenv').config({path: __dirname + '/../../../.env'});

/**
 * The process.env object contains the global environmental variables set in the root directory's .env file.
 * For deployment on Heroku, we will explicitly set the environmental variables using 'heroku config:set ENVIRONEMNTAL_VAR_NAME = value' via the heroku cli.
 */
const config = {
    user:       process.env.DATABASE_USERNAME,
    password:   process.env.DATABASE_PASSWORD,
    host:       process.env.DATABASE_HOST,
    port:       process.env.DATABASE_PORT,
    database:   process.env.DATABASE_DATABASE,
    ssl:        process.env.DATABASE_SSL
}

/**
 * A static instace of a connection pool for pgsql.
 */
const pool = new pg.Pool(config);
 
/**
 * This is a convenience method for quickly implicitly obtaining a connection, executing a single query, and releasing the connection automatically when finished.
 * Feel free to use this if you are performing a single simple query.
 * @param text The prepared query statement.
 * @param values (OPTIONAL) The arguments to the prepared query statement.
 * @param callback (OPTIONAL) A callback that may be invoked if supplied once the query executes.
 * @return A JavaScript Promise that will contain the result of the query upon success and error information upon failure.
 *         See the handling of the /db route in server.ts to see the structure of what is returned!
 */
module.exports.query = function(text, values, callback) {
    return pool.query(text, values, callback);
};
    
/**
 * This is used to grab a connection from the underlying connection pool.
 * You are expected to release the conneciton back into the pool to make it available for others to use when you are done with it.
 * To do this, call release() on the connection object returned by this method.
 * @return A connection object that can be used to execute several queries.
 */ 
module.exports.connect = function(callback) {
  return pool.connect(callback);
};
