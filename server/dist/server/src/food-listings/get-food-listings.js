'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database-util/connection-pool");
var prepared_statement_util_1 = require("./../database-util/prepared-statement-util");
var sql_logger_1 = require("../logging/sql-logger");
var food_listings_filters_1 = require("../../../shared/food-listings/food-listings-filters");
var food_listing_1 = require("../../../shared/food-listings/food-listing");
function getFoodListings(filters, donatedByAppUserKey, claimedByAppUserKey) {
    var perishableArg = generatePerishabilityArg(filters.perishable, filters.notPerishable);
    var foodTypesArg = prepared_statement_util_1.toPostgresArray(filters.foodTypes);
    // Important to wrap the received JSON stringified Date object in a new Date object (one we receive will not contain Date methods)!
    var expireDateArg = generateExpireDateArg(new Date(filters.earliestExpireDate));
    // Build our prepared statement.
    var queryString = 'SELECT * FROM getFoodListings($1, $2, null, $3, $4, $5, $6, $7, $8);';
    var queryArgs = [filters.retrievalOffset, filters.retrievalAmount,
        (filters.listingsStatus === food_listings_filters_1.LISTINGS_STATUS.unclaimedListings), foodTypesArg,
        perishableArg, expireDateArg, donatedByAppUserKey, claimedByAppUserKey];
    // Replace any NULL query arguments with literals in query string.
    queryString = prepared_statement_util_1.fixNullQueryArgs(queryString, queryArgs);
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs)
        .then(function (queryResult) {
        // Generate result array and return it.
        sql_logger_1.logSqlQueryResult(queryResult.rows);
        var resultArray = generateResultArray(queryResult.rows);
        return Promise.resolve(resultArray);
    })
        .catch(function (err) {
        console.log(err);
        return Promise.reject(new Error('Food listing search failed'));
    });
}
exports.getFoodListings = getFoodListings;
function generatePerishabilityArg(perishable, notPerishable) {
    // If exactly one filter is only active, then we apply filter.
    var notBoth = !(perishable && notPerishable);
    var notNeither = (perishable || notPerishable);
    if (notBoth && notNeither) {
        return perishable;
    }
    return null;
}
function generateExpireDateArg(earliestExpireDate) {
    if (earliestExpireDate == null)
        return null;
    return (earliestExpireDate.getMonth() + '/' + earliestExpireDate.getDate() + '/' + earliestExpireDate.getFullYear());
}
function generateResultArray(rows) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        result.push(new food_listing_1.FoodListing(rows[i].foodlistingkey, rows[i].donororganizationname, rows[i].donororganizationaddress, rows[i].donororganizationcity, rows[i].donororganizationstate, rows[i].donororganizationzip, rows[i].donorlastname, rows[i].donorfirstname, null, rows[i].foodtypes, rows[i].fooddescription, null, rows[i].perishable, rows[i].expiredate, rows[i].imgurl));
    }
    return result;
}
//# sourceMappingURL=get-food-listings.js.map