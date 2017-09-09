'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database-help/connection-pool");
var sql_logger_1 = require("../logging/sql-logger");
function claimFoodListing(foodListingKey, claimedByAppUserKey) {
    return claimOrUnclaimFoodListing(foodListingKey, claimedByAppUserKey, true);
}
exports.claimFoodListing = claimFoodListing;
function unclaimFoodListing(foodListingKey, claimedByAppUserKey) {
    return claimOrUnclaimFoodListing(foodListingKey, claimedByAppUserKey, false);
}
exports.unclaimFoodListing = unclaimFoodListing;
function claimOrUnclaimFoodListing(foodListingKey, claimedByAppUserKey, isClaim) {
    var queryString = 'SELECT * FROM ' + (isClaim ? '' : 'un') + 'claimFoodListing($1, $2)';
    var queryArgs = [foodListingKey, claimedByAppUserKey];
    sql_logger_1.logSqlQueryExec(queryString, queryArgs);
    return connection_pool_1.query(queryString, queryArgs)
        .then(function (queryResult) {
        console.log((isClaim ? 'Claim' : 'Unclaim') + ' Food Listing Successful.');
        return Promise.resolve();
    })
        .catch(function (err) {
        console.log(err);
        return Promise.reject(new Error((isClaim ? 'Claim' : 'Unclaim') + ' Food Listing Unexpectedly Failed.'));
    });
}
//# sourceMappingURL=claim-food-listing.js.map