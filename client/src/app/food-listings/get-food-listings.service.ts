"use strict";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService, Response } from "../common-util/request.service";

import { FoodListingsFilters, LISTINGS_STATUS } from "./../../../../shared/food-listings/food-listings-filters";
import { GetFoodListingsRequest, GetFoodListingsResponse } from "./../../../../shared/food-listings/get-food-listings-message";
import { FoodListing } from "./../../../../shared/food-listings/food-listing";


/*const MODELS: FoodListing[] = [
    {
        name: "Beef Stew",
        foodListingKey: 0,
        donorOrganizationName: "Stew's Stews",
        donorOrganizationAddress: "800 Beef Lane",
        donorOrganizationCity: "Williamsville",
        donorOrganizationState: "New York",
        donorOrganizationZip: 14221,
        donorLastName: "Stew",
        donorFirstName: "Steven",
        donorDistance: 6,
        foodTypeDescription: "Meat, Vegetable, Drink",
        foodDescription: "Quite the beefy stew...",
        preishable: true,
        expirationDate: "13/32/2017",
        quantityClass: "Car",
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    }
]*/


@Injectable()
export class GetFoodListingsService {
    
    private static readonly RETRIEVAL_AMOUNT: number = 10;
    private retrievalOffset: number;
    private noMoreListingsToRetrieve: boolean;

    
    constructor(
        private requestService: RequestService
    ) { 
        this.retrievalOffset = 0;
        this.noMoreListingsToRetrieve = false;
    }


    /**
     * Retrieves food listings based off of filter criteria.
     * @param filters The selected filter criteria used to limit the food listings that are retrieved on the server.
     * @param getMoreListings Set to true if the server should get more listings to be diplayed, otherwise, it will get food listings to replace
     *                        the current ones with (will start back at 0 retrieval offset).
     * @return An observable object that resolves to an object that contains the array of FoodListing objects.
     */
    public getFoodListings(filters: FoodListingsFilters, getMoreListings: boolean = false): Observable<FoodListing[]> {

        // Break out immediately if we are attempting to get more listings but have reached end!
        if (getMoreListings && this.noMoreListingsToRetrieve)  return;
        this.noMoreListingsToRetrieve = true; // We should not retrieve more listings until current request finished!

        // If we are simply getting more food listings, then we will set the retrievalOffset to the beginning of next segment of entries.
        (getMoreListings) ? this.retrievalOffset += GetFoodListingsService.RETRIEVAL_AMOUNT
                          : this.retrievalOffset = 0;

        // Set our retrieval range information for the server to filter by.
        filters.retrievalOffset = this.retrievalOffset;
        filters.retrievalAmount = GetFoodListingsService.RETRIEVAL_AMOUNT;

        // Determine the route based off of the requested Food Listings' status (Are we getting food listings for receive or cart interface).
        if (filters.listingsStatus == null)  filters.listingsStatus = LISTINGS_STATUS.unclaimedListings;
        let observer: Observable<Response> = this.requestService.post('/foodListings/getFoodListings', new GetFoodListingsRequest(filters));

        // Listen for a response now.
        return observer.map((response: Response) => {

            let getFoodListingsResponse: GetFoodListingsResponse = response.json();
            let foodListings: FoodListing[] = getFoodListingsResponse.foodListings;
            console.log(getFoodListingsResponse.message);

            // If no Food Listings came back, then there are no more to retrieve with current criteria.
            console.log('Got ' + foodListings.length + ' listings out of possible ' + GetFoodListingsService.RETRIEVAL_AMOUNT);
            this.noMoreListingsToRetrieve = (foodListings == null || foodListings.length < GetFoodListingsService.RETRIEVAL_AMOUNT);

            if (getFoodListingsResponse.success) {
                return foodListings;
            }

            // If the response success flag is false, then we will simply send back an empty array to the calling component.
            return new Array<FoodListing>();
        });
    }


    /**
     * Determines whether or not more listings can be retrieved (if we have reached end or not).
     * @return true if more listings are available for retrieval, false if not.
     */
    public canGetMoreListings(): boolean {
        return !this.noMoreListingsToRetrieve;
    }
}
