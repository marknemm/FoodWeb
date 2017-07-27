'use strict'
import { connect, query, Client, QueryResult } from '../database_help/connection_pool';
import { logSqlConnect, logSqlQueryExec, logSqlQueryResult } from '../logging/sql_logger';

export class ReceiverModel {

    constructor() {
    }

    public receiveData(foodObject): Promise<Array<object>> {
        var perishableArg: boolean = this.generatePerishabilityArg(foodObject);   
        var foodTypesArg: string = this.generateFoodTypesArg(foodObject);
        var queryArgs: Array<any>;
        var queryString: string;

        if (perishableArg != null) {
            queryArgs = [ foodTypesArg, perishableArg ]
            queryString = 'SELECT * FROM SearchFoodListing(null, $1, $2, null, null);';
        }
        else {
            queryArgs = [ foodTypesArg ];
            queryString = 'SELECT * FROM SearchFoodListing(null, $1, null, null, null);';
        }
        logSqlQueryExec(queryString, queryArgs);

        return query(queryString, queryArgs)
        .then((queryResult: QueryResult) => {
            logSqlQueryResult(queryResult.rows);
            let resultArray: Array<object> = this.generateResultArray(queryResult.rows);
            return Promise.resolve(resultArray);
        })
        .catch((err: Error) => {
            console.log(err);
            return Promise.reject(new Error('Food listing search failed'));
        });
    }

    private generatePerishabilityArg(foodObject): boolean {
        // If exactly one filter is only active, then we apply filter.
        var notBoth = !(foodObject.perishable && foodObject.notPerishable);
        var notNeither = (foodObject.perishable || foodObject.notPerishable);
        if (notBoth && notNeither) {
            return foodObject.perishable;
        }
        return null;
    }

    private generateFoodTypesArg(foodObject): string {
        let foodTypesArg: string = "{ ";

        if (foodObject.grain)       foodTypesArg += "Grain, ";
        if (foodObject.meat)        foodTypesArg += "Meat, ";
        if (foodObject.fruit)       foodTypesArg += "Fruit, ";
        if (foodObject.vegetable)   foodTypesArg += "Vegetable, ";
        if (foodObject.drink)       foodTypesArg += "Drink, ";

        foodTypesArg = foodTypesArg.substr(0, foodTypesArg.length - 2) + " }";
        return foodTypesArg;
    }

    private generateExpireDateArg(): string {
        return null;
    }

    private generateResultArray(rows: Array<any>): Array<object> {
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
};