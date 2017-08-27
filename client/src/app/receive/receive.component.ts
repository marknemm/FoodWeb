import { Component, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { FoodListingsService } from "../food-listings/food-listings.service";

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";


@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styleUrls: ['./receive.component.css'],
    providers: [FoodListingsService]
})
export class ReceiveComponent {
    
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
