import { Component, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { FoodListingsService } from "../food-listings/food-listings.service";

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";


/*const FOOD_LISTINGS_MODEL: FoodListing[] = [
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


@Component({
    selector: 'app-receiver',
    templateUrl: './receiver.component.html',
    styleUrls: ['./receiver.component.css'],
    providers: [FoodListingsService]
})
export class ReceiverComponent {
    
    @ViewChild('foodListingsFilters') foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') foodListingsComponent: FoodListingsComponent;

    constructor(
        private foodListingsService: FoodListingsService
    ) { }

    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    ngAfterViewInit() {
        // This is how you would add the code behind for additional filters specific to the receiver form.
        //this.foodListingsFiltersComponent.addControl('dummyControl', new FormControl('dummy control'));
        this.handleFilterUpdate(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.handleFilterUpdate.bind(this));
    }

    /**
     * Handles filter updates by setting any necessary additional values in the filters and passing them off to the Food Listings Componet.
     * @param foodListingsFilters The updated Food Listing Filters.
     */
    private handleFilterUpdate(foodListingsFilters: FoodListingsFilters): void {
        foodListingsFilters.unclaimedOnly = true;
        this.foodListingsComponent.refreshFoodListings(foodListingsFilters);
    }

    /**
     * Claims the currently selected Food Listing.
     */
    private claimSelectedFoodListing(): void {
        let selectedFoodListing: FoodListing = this.foodListingsComponent.getSelectedFoodListing();
        let observer: Observable<void> = this.foodListingsService.claimFoodListing(selectedFoodListing.foodListingKey);
        
        // Listen for result.
        observer.subscribe(
            () => {
                // On success, simply remove the Food Listing from the Receiver Food Listings interface.
                this.foodListingsComponent.removeSelectedFoodListing();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
