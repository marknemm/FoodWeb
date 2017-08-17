import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/router';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';

import { GetFoodTypesResponse } from '../../../../../shared/food-listings/get-food-types-message';


/**
 * A global service that is used to load Food Types before displaying certain components or pages.
 */
@Injectable()
export class FoodTypesService implements Resolve<string[]> {
    
    private static readonly JSON_HEADERS: Headers = new Headers({
        'Content-Type': 'application/json'
    });

    // We will cache any Food Types that come back from the server so we only need to contact server once!
    private static foodTypesCache: string[] = null;

    constructor(private http: Http) {}

    /**
     * Retrieves food types from the server if they have not previously been retrieved. Otherwise, fetches them from contained cache.
     * @return An observable object that resolves to an array of food type strings.
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
        return this.getFoodTypes();
    }

    /**
     * Retrieves food types from the server if they have not previously been retrieved. Otherwise, fetches them from contained cache.
     * @return An observable object that resolves to an array of food type strings.
     */
    public getFoodTypes(): Observable<string[]> {
        // If we do not have cached Food Types, then we will contact the server.
        if (FoodTypesService.foodTypesCache === null) {
            let observer: Observable<Response> = this.http.get('/foodListings/getFoodTypes',
                                                               { headers: FoodTypesService.JSON_HEADERS, withCredentials: true });

            return observer.map((response: Response) => {
                let getFoodTypesResponse: GetFoodTypesResponse = response.json();
                console.log(getFoodTypesResponse.message);

                if (getFoodTypesResponse.success) {
                    FoodTypesService.foodTypesCache = getFoodTypesResponse.foodTypes;
                    return getFoodTypesResponse.foodTypes;
                }
                
                // On failure, simply goto catch callback below!
                throw new Error(getFoodTypesResponse.message);
            })
            .catch((err: any, caught: Observable<string[]>) => {
                console.log(err);
                // Simply fill the Food Types with dummy data for now if cannot properly communicate with the server.
                FoodTypesService.foodTypesCache = ['Food Type 1', 'Food Type 2', 'Food Type 3'];
                return Observable.of(FoodTypesService.foodTypesCache);
            });
        }
        // Else, we do have cached Food Types, and we have no need of contacting the server.
        else {
            return Observable.of(FoodTypesService.foodTypesCache);
        }
    }

    /**
     * Examines an object with Food Type keys and boolean values and extracts the Food Types that are associated with true.
     * @param foodTypeBooleans An object that contains Food Type keys associated with boolean values.
     */
    public getFoodTypesAssocWithTrue(foodTypeBooleans: object): string[] {
        let foodTypesAssocWithTrue: string[] = [];
        let allFoodTypes: string[] = Object.keys(foodTypeBooleans);

        // Iterate through all the food types and add those that are associated w/ true to the return list.
        for (let i: number = 0; i < allFoodTypes.length; i++) {
            if (foodTypeBooleans[allFoodTypes[i]] === true) {
                foodTypesAssocWithTrue.push(allFoodTypes[i]);
            }
        }

        return foodTypesAssocWithTrue;
    }
};
