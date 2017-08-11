import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';


//import { Food } from '../receiver/shared/food';
import { FoodListingsFilters } from "./food-listings-filters/food-listings-filters";


/*const MODELS: Food[] = [
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
export class FoodListingsService {
    
    private retrievalOffset: number;
    private static readonly RETRIEVAL_AMOUNT: number = 20;
    private static readonly JSON_HEADERS: Headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(private http: Http) { 
        this.retrievalOffset = 0;
    }

    /**
     * Retrieves food listings based off of filter criteria.
     * @param filters The selected filter criteria used to limit the food listings that are retrieved on the server.
     * @param getMoreListings Set to true if the server should get more listings to be diplayed, otherwise, it will get food listings to replace
     *                        the current ones with (will start back at 0 retrieval offset).
     * @return An observable object that resolves to an object that contains the array of FoodListing objects.
     */
    public getFoodListings(filters: FoodListingsFilters, getMoreListings: boolean = false): Observable<any> {

        // If we are simply getting more food listings, then we will set the retrievalOffset to the beginning of next segment of entries.
        (getMoreListings) ? this.retrievalOffset += FoodListingsService.RETRIEVAL_AMOUNT
                          : this.retrievalOffset = 0;

        // Set our retrieval range information for the server to filter by.
        filters.retrievalOffset = this.retrievalOffset;
        filters.retrievalAmount = FoodListingsService.RETRIEVAL_AMOUNT;

        let observer: Observable<Response> = this.http.post('/foodListings/getFoodListings',
                                                            JSON.stringify(filters),
                                                            { headers: FoodListingsService.JSON_HEADERS, withCredentials: true });
        return observer.map((response: Response) => {
            console.log(response.json());
            return response.json();
        });
    }
}