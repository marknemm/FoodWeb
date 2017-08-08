'use strict'
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { fixNullQueryArgs } from '../database_help/prepared-statement-helper';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';

export function getFoodListing(foodObject, requesetedByAppUserKey: number): Promise<Array<object>> {
    var perishableArg: boolean = generatePerishabilityArg(foodObject);   
    var foodTypesArg: string = generateFoodTypesArg(foodObject);
    var expireDateArg: string = generateExpireDateArg(foodObject);
    var queryArgs: Array<any> = new Array<any>();
   
    // Build our prepared statement.
    var queryString: string = 'SELECT * FROM getFoodListings(null, $1, $2, null, $3, $4);';
    queryArgs = [ foodTypesArg, perishableArg, expireDateArg, requesetedByAppUserKey ];
    queryString = fixNullQueryArgs(queryString, queryArgs);

    // Log and execute query.
    logSqlQueryExec(queryString, queryArgs);

    return query(queryString, queryArgs)
    .then((queryResult: QueryResult) => {
        // Generate result array and return it.
        logSqlQueryResult(queryResult.rows);
        let resultArray: Array<object> = generateResultArray(queryResult.rows);
        return Promise.resolve(resultArray);
    })
    .catch((err: Error) => {
        console.log(err);
        return Promise.reject(new Error('Food listing search failed'));
    });
}

function generatePerishabilityArg(foodObject): boolean {
    // If exactly one filter is only active, then we apply filter.
    var notBoth = !(foodObject.perishable && foodObject.notPerishable);
    var notNeither = (foodObject.perishable || foodObject.notPerishable);
    if (notBoth && notNeither) {
        return foodObject.perishable;
    }
    return null;
}

function generateRequestedByAppUserKey(foodObject, sessionObject): number{
    if(foodObject.filterByRequester == true){
        if(sessionObject.appUserKey != null){
            return sessionObject.appUserKey
        }
        else return -1;
    }
    else return null;
}

function generateFoodTypesArg(foodObject): string {
    let foodTypesArg: string = null;

    if (foodObject.grain || foodObject.meat || foodObject.fruit || foodObject.vegetable || foodObject.drink) {
        foodTypesArg = "{ ";

        if (foodObject.grain)       foodTypesArg += "Grain, ";
        if (foodObject.meat)        foodTypesArg += "Meat, ";
        if (foodObject.fruit)       foodTypesArg += "Fruit, ";
        if (foodObject.vegetable)   foodTypesArg += "Vegetable, ";
        if (foodObject.drink)       foodTypesArg += "Drink, ";

        foodTypesArg = foodTypesArg.substr(0, foodTypesArg.length - 2) + " }";
    }

    return foodTypesArg;
}

function generateExpireDateArg(foodObject): string {
    return (foodObject.minExpireAfterDays.month + '/' + foodObject.minExpireAfterDays.day + '/' + foodObject.minExpireAfterDays.year);
}

function generateResultArray(rows: Array<any>): Array<object> {
    let result: Array<object> = [];

    for (let i: number = 0; i < rows.length; i++) {
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