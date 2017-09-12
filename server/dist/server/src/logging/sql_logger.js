"use strict";
// This file contains some function definitions for logging information pertaining to SQL.
Object.defineProperty(exports, "__esModule", { value: true });
var _enclosingString = "\n=================================================\n";
/**
 * Formats and prints out a message pertaining to the success of obtaining a SQL connection.
 * @param err: If provided, then it signifies that obtaining the connection failed. If not provided, then it signifies that the connection was successful.
 */
function logSqlConnect(err) {
    console.log(_enclosingString);
    // If no error provided, then simply log that the connection succeeded.
    if (err != null) {
        console.log("SQL connection obtained successfully");
    }
    else {
        console.log("SQL connect failed with error message: ");
        console.log(err);
    }
    console.log(_enclosingString);
}
exports.logSqlConnect = logSqlConnect;
/**
 * Formats and prints out information pertaining to executing a SQL Query.
 * @param query: The SQL query.
 * @param args: The arguments to the SQL query if using a prepared statement.
 */
function logSqlQueryExec(query, args) {
    console.log(_enclosingString);
    // Print the SQL query.
    console.log("SQL Query: ");
    console.log(query);
    // Print the arguments to the SQL query.
    if (args != null) {
        console.log("SQL Query Arguments: ");
        for (var i = 0; i < args.length; i++) {
            console.log((i + 1).toString() + "$: " + args[i]);
        }
    }
    console.log(_enclosingString);
}
exports.logSqlQueryExec = logSqlQueryExec;
/**
 * Formats and prints out information pertaining to the result of a SQL Query.
 * @param rows The resulting rows of the SQL Query.
 */
function logSqlQueryResult(rows) {
    console.log(_enclosingString);
    console.log("Number of rows in query result: " + rows.length);
    if (rows.length > 0) {
        console.log("\n");
        console.log(rows);
    }
    console.log(_enclosingString);
}
exports.logSqlQueryResult = logSqlQueryResult;
//# sourceMappingURL=sql_logger.js.map