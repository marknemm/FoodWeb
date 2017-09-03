"use strict";
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ClaimFoodListingRequest } from "./../../../../shared/food-listings/claim-food-listing-message";
import { FoodWebResponse } from "./../../../../shared/message-protocol/food-web-response";


@Injectable()
export class ClaimFoodListingService {
    
    private static readonly JSON_HEADERS: Headers = new Headers({
        'Content-Type': 'application/json'
    });

    
    constructor(private http: Http) { }


    /**
     * Claims a given Food Listing.
     * @param foodListingKey The key (identifier) for the Food Listing that is to be claimed.
     * @return An observable that has no payload (simply resolves on success).
     */
    public claimFoodListing(foodListingKey: number): Observable<void> {
        return this.claimOrUnclaimFoodListing(foodListingKey, true);
    }


    /**
     * Unclaims a given Food Listing.
     * @param foodListingKey The key (identifier) for the Food Listing that is to be unclaimed.
     * @return An observable that has no payload (simply resolves on success).
     */
    public unclaimFoodListing(foodListingKey: number): Observable<void> {
        return this.claimOrUnclaimFoodListing(foodListingKey, false);
    }


    /**
     * Uniform function for sending both claim and unclaim food listing messages to server.
     * @param foodListingKey The key identifier of the food listing that is to be claimed or unclaimed.
     * @param isClaim Set to true if this is a claim, set to false if it is an unclaim.
     * @return An observable that has no payload (simply resolves on success).
     */
    private claimOrUnclaimFoodListing(foodListingKey: number, isClaim: boolean): Observable<void> {
        let claimFoodListingRequest: ClaimFoodListingRequest = new ClaimFoodListingRequest(foodListingKey);
        let observer: Observable<Response> = this.http.post('/foodListings/' + (isClaim ? '' : 'un') + 'claimFoodListing',
                                                            JSON.stringify(claimFoodListingRequest),
                                                            { headers: ClaimFoodListingService.JSON_HEADERS, withCredentials: true });

        // Listen for a response now.
        return observer.map((response: Response) => {
            let claimFoodListingResponse: FoodWebResponse = response.json();
            // On failure.
            if (!claimFoodListingResponse.success) {
                console.log(claimFoodListingResponse.message);
                throw new Error(claimFoodListingResponse.message);
            }
        });
    }
}