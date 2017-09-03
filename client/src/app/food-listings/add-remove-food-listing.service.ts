import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FoodListingUpload } from "./../../../../shared/food-listings/food-listing-upload";
import { AddFoodListingRequest, AddFoodListingResponse } from "./../../../../shared/food-listings/add-food-listing-message";
import { FoodWebResponse } from "./../../../../shared/message-protocol/food-web-response";
import { ClaimFoodListingRequest } from "./../../../../shared/food-listings/claim-food-listing-message";


@Injectable()
export class AddRemoveFoodListingService {

    private static readonly HEADERS: Headers = new Headers({
        'Content-Type': 'application/json'
    });


    constructor(
        private http: Http
    ) { }


    /**
     * Adds a food listing on the server.
     * @param foodListing The food listing to be added.
     * @param imageUpload The image component of the food listing that is to be added.
     * @return An observable that on success will provide the added food listings key (unique ID).
     */
    public addFoodListing(foodListingUpload: FoodListingUpload, imageUpload: string): Observable<number> {
        foodListingUpload.imageUpload = imageUpload;

        let observer: Observable<Response> = this.http.post('/foodListings/addFoodListing', new AddFoodListingRequest(foodListingUpload),
                                                            { headers: AddRemoveFoodListingService.HEADERS, withCredentials: true });
        return observer.map((response: Response) => {
            let addFoodListingResponse: AddFoodListingResponse = response.json();
            console.log(addFoodListingResponse.message);

            if (addFoodListingResponse.success) {
                return addFoodListingResponse.foodListingKey;
            }
            throw new Error(addFoodListingResponse.message);
        });
    }


    /**
     * Permanently removes a food listing from the server. Also triggers the removal of all claims on the food listing as well.
     * @param foodListingKey The key identifier of the food listing that is to be removed.
     */
    public removeFoodListing(foodListingKey: number): Observable<void> {
        let observer: Observable<Response> = this.http.post('/foodListings/removeFoodListing', new ClaimFoodListingRequest(foodListingKey),
                                                            { headers: AddRemoveFoodListingService.HEADERS, withCredentials: true });
        return observer.map((response: Response) => {
            let removeFoodListingResponse: FoodWebResponse = response.json();
            console.log(removeFoodListingResponse.message);

            if (!removeFoodListingResponse.success) {
                throw new Error(removeFoodListingResponse.message);
            }
        });
    }
}
