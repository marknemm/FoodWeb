'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database-help/connection-pool");
var sql_logger_1 = require("../logging/sql-logger");
/**
 * Gets all food types from the FoodType domain table in the database.
 * @return A promise that resolves to an array of food type strings.
 */
function getFoodTypes() {
    var queryString = 'SELECT foodType AS "foodType" FROM FoodType;';
    sql_logger_1.logSqlQueryExec(queryString);
    return connection_pool_1.query(queryString)
        .then(processFoodTypeSelectResult)
        .catch(function (err) {
        // Should never happen!
        console.log(err);
        return Promise.reject(new Error('Failed to get food types'));
    });
}
exports.getFoodTypes = getFoodTypes;
/**
 * Processes the result of the food type select query. Packages the results into an array of food type strings.
 * @param queryResult The result of the food type select query.
 * @return See return type of getFoodTypes.
 */
function processFoodTypeSelectResult(queryResult) {
    var foodTypes = [];
    sql_logger_1.logSqlQueryResult(queryResult.rows);
    for (var i = 0; i < queryResult.rowCount; i++) {
        foodTypes.push(queryResult.rows[i].foodType);
    }
    return Promise.resolve(foodTypes);
}
//# sourceMappingURL=get-food-types.js.map