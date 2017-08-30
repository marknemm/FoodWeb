import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FoodListingUpload } from "../../../../shared/food-listings/food-listing-upload";
import { AddFoodListingRequest, AddFoodListingResponse } from "../../../../shared/food-listings/add-food-listing-message";


@Injectable()
export class DonateService {
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
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        foodListingUpload.imageUpload = imageUpload;

        let observer: Observable<Response> = this.http.post('/foodListings/addFoodListing', new AddFoodListingRequest(foodListingUpload),
                                                            {headers: headers, withCredentials: true});
        return observer.map((response : Response) => {
            let addFoodListingResponse: AddFoodListingResponse = response.json();
            console.log(addFoodListingResponse.message);
            
            if (addFoodListingResponse.success) {
                return addFoodListingResponse.foodListingKey;
            }
            throw new Error(addFoodListingResponse.message);
        });
    }
}