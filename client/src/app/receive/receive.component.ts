import { Component, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { ClaimFoodListingService } from "../food-listings/claim-food-listing.service";

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";


@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styleUrls: ['./receive.component.css'],
    providers: [ClaimFoodListingService]
})
export class ReceiveComponent {
    
    @ViewChild('foodListingsFilters') private foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') private foodListingsComponent: FoodListingsComponent;

    constructor(
        private claimFoodListingService: ClaimFoodListingService
    ) { }

    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    ngAfterViewInit() {
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
    }

    /**
     * Claims the currently selected Food Listing.
     */
    private claimSelectedFoodListing(): void {
        let selectedFoodListing: FoodListing = this.foodListingsComponent.getSelectedFoodListing();
        let observer: Observable<void> = this.claimFoodListingService.claimFoodListing(selectedFoodListing.foodListingKey);
        
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
