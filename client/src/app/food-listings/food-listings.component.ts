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

    /**
     * The header that will be displayed at the top of the Food Listings list.
     */
    @Input() private header: string = 'Food Listings';
    /**
     * Determines if this dialog is displaying Food Listing info for a Receiver's Cart. Default is false.
     */
    @Input() private isClaimedCart: boolean = false;
    /**
     * Determines if this dialog is displaying Food Listing info for a Donor's Cart. Default is false.
     */
    @Input() private isDonatedCart: boolean = false;

    @ViewChild('FoodListingDialogComponent') private foodListingDialog: FoodListingDialogComponent;

    private filters: FoodListingsFilters;
    private foodListings: Array<FoodListing>;
    private selectedFoodListingIndex: number;


    public constructor(
        private getFoodListingsService: GetFoodListingsService
    ) {
        this.foodListings = new Array<FoodListing>();
        this.selectedFoodListingIndex = null;
        window.onscroll = this.listenForLoadMoreListings.bind(this);
    }


    /**
     * Refreshes the food listings using the new set of filters criteria. The offset used to retreive a certain range of food listings will be
     * reset to 0.
     * @param filters The filter criteria. 
     */
    public refreshFoodListings(filters: FoodListingsFilters): void {
        this.filters = filters; // Save reference to last applied filters for when we internally need more Food Listings (scroll near bottom).
        let observer: Observable<FoodListing[]> = this.getFoodListingsService.getFoodListings(filters);
        this.foodListings = new Array<FoodListing>(); // Empty our current model list while we wait for server results.

        observer.subscribe((foodListings: Array<FoodListing>) => {
            this.foodListings = foodListings;
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
     * Listens for the user to scroll the Food Listings near the bottom and then loads more listings.
     */
    private listenForLoadMoreListings(): void {

        // Break out immediately if we cannot get any more Food Listings right now.
        if (!this.getFoodListingsService.canGetMoreListings())  return;

        // Determine offset of load more threshold in pixels from bottom of page.
        const THRESHOLD_OFFSET: number = 500;

        // Get the current bottom scroll position and the threshold for loading more.
        let currentScrollPosition: number = (window.scrollY + window.innerHeight);
        let loadThresholdPosition: number = (document.body.offsetHeight - THRESHOLD_OFFSET);

        // If we are near the bottom of the page, then load more listings!
        if (this.filters != null && (currentScrollPosition >= loadThresholdPosition)) {
            
            let observer: Observable<FoodListing[]> = this.getFoodListingsService.getFoodListings(this.filters, true);
            
            // Concatenate the resulting Food Listings that come back!
            observer.subscribe((foodListings: Array<FoodListing>) => {
                this.foodListings = this.foodListings.concat(foodListings);
            });
        }
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
