'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database_help/connection_pool");
var prepared_statement_helper_1 = require("../database_help/prepared-statement-helper");
var sql_logger_1 = require("../logging/sql_logger");
function getFoodListing(foodObject) {
    var perishableArg = generatePerishabilityArg(foodObject);
    var foodTypesArg = generateFoodTypesArg(foodObject);
    var expireDateArg = generateExpireDateArg(foodObject);
    var queryArgs = new Array();
    // Build our prepared statement.
    var queryString = 'SELECT * FROM getFoodListings(null, $1, $2, null, $3);';
    queryArgs = [foodTypesArg, perishableArg, expireDateArg];
    queryString = prepared_statement_helper_1.fixNullQueryArgs(queryString, queryArgs);
    // Log and execute query.
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
exports.getFoodListing = getFoodListing;
function generatePerishabilityArg(foodObject) {
    // If exactly one filter is only active, then we apply filter.
    var notBoth = !(foodObject.perishable && foodObject.notPerishable);
    var notNeither = (foodObject.perishable || foodObject.notPerishable);
    if (notBoth && notNeither) {
        return foodObject.perishable;
    }
    return null;
}
function generateFoodTypesArg(foodObject) {
    var foodTypesArg = null;
    if (foodObject.grain || foodObject.meat || foodObject.fruit || foodObject.vegetable || foodObject.drink) {
        foodTypesArg = "{ ";
        if (foodObject.grain)
            foodTypesArg += "Grain, ";
        if (foodObject.meat)
            foodTypesArg += "Meat, ";
        if (foodObject.fruit)
            foodTypesArg += "Fruit, ";
        if (foodObject.vegetable)
            foodTypesArg += "Vegetable, ";
        if (foodObject.drink)
            foodTypesArg += "Drink, ";
        foodTypesArg = foodTypesArg.substr(0, foodTypesArg.length - 2) + " }";
    }
    return foodTypesArg;
}
function generateExpireDateArg(foodObject) {
    return (foodObject.minExpireAfterDays.month + '/' + foodObject.minExpireAfterDays.day + '/' + foodObject.minExpireAfterDays.year);
}
function generateResultArray(rows) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        result.push({
            foodListingKey: rows[i].foodlistingkey,
            foodTypeDescription: rows[i].foodtypedescription,
            foodDescription: rows[i].fooddescription,
            perishable: rows[i].perishable,
            donorOrganizationName: rows[i].donororganizationname,
            donorOrganizationAddress: rows[i].donororganizationaddress,
            donorOrganizationCity: rows[i].donororganizationcity,
            donorOrganizationState: rows[i].donororganizationstate,
            donorOrganizationZip: rows[i].donororganizationzip,
            donorLastName: rows[i].donorlastname,
            donorFirstName: rows[i].donorfirstname,
            expirationDate: rows[i].expiredate,
            imgUrl: rows[i].imgurl
        });
    }
    return result;
}
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/food-listing/get-food-listings.js.map