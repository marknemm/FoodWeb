import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";

import { FoodListingDialogComponent } from './food-listing-dialog/food-listing-dialog.component';
import { GetFoodListingsService } from "./get-food-listings.service";

import { FoodListing } from '../../../../shared/food-listings/food-listing';
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";


@Component({
    selector: 'app-food-listings',
    templateUrl: './food-listings.component.html',
    styleUrls: ['./food-listings.component.css'],
    providers: [GetFoodListingsService]
})
export class FoodListingsComponent {

    @Input() private header: string = 'Food Listings';

    @ViewChild('FoodListingDialogComponent') private foodListingDialog: FoodListingDialogComponent;

    private foodListings: Array<FoodListing>;
    private selectedFoodListingIndex: number;


    public constructor(
        private getFoodListingsService: GetFoodListingsService
    ) {
        this.foodListings = new Array<FoodListing>();
        this.selectedFoodListingIndex = null;
    }


    /**
     * Refreshes the food listings using the new set of filters criteria. The offset used to retreive a certain range of food listings will be
     * reset to 0.
     * @param filters The filter criteria. 
     */
    public refreshFoodListings(filters: FoodListingsFilters): void {
        let observer: Observable<FoodListing[]> = this.getFoodListingsService.getFoodListings(filters);

        observer.subscribe((foodListings: FoodListing[]) => {
            this.foodListings = foodListings as FoodListing[];
        });
    }


    /**
     * Gets the selected Food Listing.
     * @return The selected Food Listing.
     */
    public getSelectedFoodListing(): FoodListing {
        if (this.selectedFoodListingIndex != null) {
            return this.foodListings[this.selectedFoodListingIndex];
        }
        return null;
    }


    /**
     * Removes the selected Food Listing.
     */
    public removeSelectedFoodListing(): void {
        // Close any modal details popup related to the Food Listing we are deleting.
        if (this.foodListingDialog.isOpen())  this.foodListingDialog.close();
        
        // Remove the Food Listing from the contained array model.
        this.foodListings.splice(this.selectedFoodListingIndex, 1);
        this.selectedFoodListingIndex = null;
    }


    /**
     * Displays a Food Listing details modal popup.
     * @param selectedFoodListing The selected Food Listing.
     */
    private showDetails(selectedFoodListingIndex: number): void {
        this.selectedFoodListingIndex = selectedFoodListingIndex;

        this.foodListingDialog.open(this.foodListings[selectedFoodListingIndex])
            .then(() => {}) // Don't care about successful close of dialog...
            .catch((err: Error) => {
                if (err)  console.log(err);
            });
    }
}
