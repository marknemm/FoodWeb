// This file contains some function definitions for logging information pertaining to SQL.

let _enclosingString : string = "\n=================================================\n";

/**
 * Formats and prints out a message pertaining to the success of obtaining a SQL connection.
 * @param err: If provided, then it signifies that obtaining the connection failed. If not provided, then it signifies that the connection was successful.
 */
export function logSqlConnect(err? : Error) : void {
    console.log(_enclosingString);

    // If no error provided, then simply log that the connection succeeded.
    if (err != null) {
        console.log("SQL connection obtained successfully");
    }
    // If an error is provided, then log that obtaining the connection failed and the error.
    else {
        console.log("SQL connect failed with error message: ");
        console.log(err);
    }

    console.log(_enclosingString);
}

/**
 * Formats and prints out information pertaining to executing a SQL Query.
 * @param query: The SQL query.
 * @param args: The arguments to the SQL query if using a prepared statement.
 */
export function logSqlQueryExec(query : string, args? : Array<any>) : void {
    console.log(_enclosingString);

    // Print the SQL query.
    console.log("SQL Query: ");
    console.log(query);
    
    // Print the arguments to the SQL query.
    if (args != null) {
        console.log("SQL Query Arguments: ");
        for (let i : number = 0; i < args.length; i++) {
            console.log((i + 1).toString() + "$: " + args[i].toString());
        }
    }

    console.log(_enclosingString);
}

/**
 * Formats and prints out information pertaining to the result of a SQL Query.
 * @param rows The resulting rows of the SQL Query.
 */
export function logSqlQueryResult(rows : Array<any>) : void {
    console.log(_enclosingString);

    console.log("Number of rows in query result: " + rows.length.toString());

    if (rows.length > 0) {
        console.log("\n");
        console.log(rows);
    }

    console.log(_enclosingString);
}
