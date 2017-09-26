import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";

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

    private foodListings: Array<FoodListing>;
    private selectedFoodListingIndex: number;
    private modalFoodListingDetails: NgbModalRef;


    constructor(
        private modalService: NgbModal,
        private getFoodListingsService: GetFoodListingsService
    ) {
        this.foodListings = new Array<FoodListing>();
        this.selectedFoodListingIndex = null;
        this.modalFoodListingDetails = null;
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
        if (this.modalFoodListingDetails != null) {
            this.modalFoodListingDetails.close();
            this.modalFoodListingDetails = null;
        }
        
        // Remove the Food Listing from the contained array model.
        this.foodListings.splice(this.selectedFoodListingIndex, 1);
        this.selectedFoodListingIndex = null;
    }


    /**
     * Displays a Food Listing details modal popup.
     * @param detailsHTML The Food Listing detals modal HTML Element.
     * @param selectedFoodListing The selected Food Listing.
     */
    private showDetails(detailsHTML: HTMLElement, selectedFoodListingIndex: number): void {
        this.selectedFoodListingIndex = selectedFoodListingIndex;
        this.modalFoodListingDetails = this.modalService.open(detailsHTML);
        this.modalFoodListingDetails.result.then((result: string) => {
            // Don't really need to listen for any signals from details modal popup since parent will be handling any non-close button presses!
        })
        .catch((err: Error) => {
            if (err)  console.log(err);
        });
    }
}
