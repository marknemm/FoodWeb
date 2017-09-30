import { Component, Input, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { FoodListing } from './../../../../../shared/food-listings/food-listing';


@Component({
  selector: 'food-listing-dialog',
  templateUrl: './food-listing-dialog.component.html',
  styleUrls: ['./food-listing-dialog.component.css', '../food-listings.component.css']
})
export class FoodListingDialogComponent {

    @ViewChild('detailsHTML') private detailsHTML: HTMLTemplateElement;

    private foodListing: FoodListing;
    private modalFoodListingDetails: NgbModalRef;


    public constructor(
        private modalService: NgbModal,
    ) {
        this.modalFoodListingDetails = null;
    }


    /**
     * Displays the food details dialog.
     * @param foodListing The food listing to display the details of.
     * @return An observable that will resolve when the dialog closes.
     */
    public open(foodListing: FoodListing): Promise<void> {
        this.foodListing = foodListing;
        const options: NgbModalOptions = {
            windowClass: 'food-details' // This is important. It allows us to isolate styles to this modal dialog (they will not appear in login)!
        };
        this.modalFoodListingDetails = this.modalService.open(this.detailsHTML, options);
        return this.modalFoodListingDetails.result;
    }


    /**
     * Checks if the dialog is open.
     * @return true if the dialog is open, false if not.
     */
    public isOpen(): boolean {
        return (this.modalFoodListingDetails != null);
    }


    /**
     * Hides (or closes) the food details dialog.
     */
    public close(): void {
        this.modalFoodListingDetails.close();
        this.modalFoodListingDetails = null;
    }
}
