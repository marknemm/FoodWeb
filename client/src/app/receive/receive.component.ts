import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs/Observable";

import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { ClaimFoodListingService } from "../food-listings/food-listing-services/claim-unclaim-food-listing.service";

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";


@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styleUrls: ['./receive.component.css'],
    providers: [ClaimFoodListingService]
})
export class ReceiveComponent implements OnInit {

    @ViewChild('foodListingsFilters') private foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') private foodListingsComponent: FoodListingsComponent;

    private minFiltersWidth: string;


    constructor(
        private claimFoodListingService: ClaimFoodListingService
    ) {
        this.minFiltersWidth = '262px';
    }


    /**
     * Executes after all input bindings have been established but before view children have been fully initialized.
     */
    public ngOnInit(): void {
        this.foodListingsFiltersComponent.addControl('matchAvailability', new FormControl(true));
    }


    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    public ngAfterViewInit(): void {
        this.foodListingsComponent.refreshList(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshList.bind(this.foodListingsComponent));
    }


    /**
     * Claims the currently selected Food Listing.
     */
    private claimSelectedFoodListing(): void {
        let selectedFoodListing: FoodListing = this.foodListingsComponent.getSelectedListing();
        let observer: Observable<void> = this.claimFoodListingService.claimFoodListing(selectedFoodListing.foodListingKey);
        
        // Listen for result.
        observer.subscribe(
            () => {
                // On success, simply remove the Food Listing from the Receiver Food Listings interface.
                this.foodListingsComponent.removeSelectedListing();
            },
            (err: Error) => {
                console.log(err);
            }
        );
    }
}
