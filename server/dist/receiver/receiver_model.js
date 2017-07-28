'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pool_1 = require("../database_help/connection_pool");
var sql_logger_1 = require("../logging/sql_logger");
var ReceiverModel = (function () {
    function ReceiverModel() {
    }
    ReceiverModel.prototype.receiveData = function (foodObject) {
        var _this = this;
        var perishableArg = this.generatePerishabilityArg(foodObject);
        var foodTypesArg = this.generateFoodTypesArg(foodObject);
        var queryArgs;
        var queryString;
        if (perishableArg != null) {
            queryArgs = [foodTypesArg, perishableArg];
            queryString = 'SELECT * FROM SearchFoodListing(null, $1, $2, null, null);';
        }
        else {
            queryArgs = [foodTypesArg];
            queryString = 'SELECT * FROM SearchFoodListing(null, $1, null, null, null);';
        }
        sql_logger_1.logSqlQueryExec(queryString, queryArgs);
        return connection_pool_1.query(queryString, queryArgs)
            .then(function (queryResult) {
            sql_logger_1.logSqlQueryResult(queryResult.rows);
            var resultArray = _this.generateResultArray(queryResult.rows);
            return Promise.resolve(resultArray);
        })
            .catch(function (err) {
            console.log(err);
            return Promise.reject(new Error('Food listing search failed'));
        });
    };
    ReceiverModel.prototype.generatePerishabilityArg = function (foodObject) {
        // If exactly one filter is only active, then we apply filter.
        var notBoth = !(foodObject.perishable && foodObject.notPerishable);
        var notNeither = (foodObject.perishable || foodObject.notPerishable);
        if (notBoth && notNeither) {
            return foodObject.perishable;
        }
        return null;
    };
    ReceiverModel.prototype.generateFoodTypesArg = function (foodObject) {
        var foodTypesArg = "{ ";
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
        return foodTypesArg;
    };
    ReceiverModel.prototype.generateExpireDateArg = function () {
        return null;
    };
    ReceiverModel.prototype.generateResultArray = function (rows) {
        var result = [];
        for (var i = 0; i < rows.length; i++) {
            result.push({
                foodListingKey: rows[i].foodlistingkey,
                foodTypeDescription: rows[i].foodtypedescription,
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
    };
    return ReceiverModel;
}());
exports.ReceiverModel = ReceiverModel;
;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/server/dist/receiver/receiver_model.js.map