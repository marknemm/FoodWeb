import { Component, Input, ViewChild } from '@angular/core';

import { FoodListing } from './../../../../../shared/food-listings/food-listing';
import { AbstractSlickListDialog } from '../../slick-list/slick-list-dialog/abstract-slick-list-dialog';


@Component({
  selector: 'food-listing-dialog',
  templateUrl: './food-listing-dialog.component.html',
  styleUrls: ['./food-listing-dialog.component.css', '../food-listings.component.css']
})
export class FoodListingDialogComponent extends AbstractSlickListDialog {
    
    /**
     * The currently selected Food Listing.
     */
    @Input() private selectedFoodListing: FoodListing;
    /**
     * Determines if this dialog is displaying Food Listing info for a Receiver's Cart. Default is false.
     */
    @Input() private isClaimedCart: boolean = false;
    /**
     * Determines if this dialog is displaying Food Listing info for a Donor's Cart. Default is false.
     */
    @Input() private isDonatedCart: boolean = false;

    /**
     * This is a shadow of the slickListDialog member in AbstractSlickListDialog.
     * It is all that is needed to make basic dialog functions work (open, close, etc).
     */
    @ViewChild('SlickListDialogComponent') protected slickListDialog: AbstractSlickListDialog; 


    public constructor() {
        super();
    }
}
