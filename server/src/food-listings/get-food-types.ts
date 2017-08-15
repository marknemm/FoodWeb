'use strict'
import { query, QueryResult } from '../database_help/connection_pool';
import { logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';

/**
 * Gets all food types from the FoodType domain table in the database.
 * @return A promise that resolves to an array of food type strings.
 */
export function getFoodTypes(): Promise<Array<string>> {
    let queryString = 'SELECT foodType AS "foodType" FROM FoodType;'
    logSqlQueryExec(queryString);

    return query(queryString)
        .then(processFoodTypeSelectResult)
        .catch((err: Error) => {
            // Should never happen!
            console.log(err);
            return Promise.reject(new Error('Failed to get food types'));
        });
}

/**
 * Processes the result of the food type select query. Packages the results into an array of food type strings.
 * @param queryResult The result of the food type select query.
 * @return See return type of getFoodTypes.
 */
function processFoodTypeSelectResult(queryResult: QueryResult): Promise<Array<string>> {
    let foodTypes: Array<string> = [];

    logSqlQueryResult(queryResult.rows);

    for (let i: number = 0; i < queryResult.rowCount; i++) {
        foodTypes.push(queryResult.rows[i].foodType);
    }

    return Promise.resolve(foodTypes);
}