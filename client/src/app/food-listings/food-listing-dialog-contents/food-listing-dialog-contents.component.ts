import { Component, Input } from '@angular/core';

import { FoodListing } from './../../../../../shared/food-listings/food-listing';


@Component({
  selector: 'food-listing-dialog-contents',
  templateUrl: './food-listing-dialog-contents.component.html',
  styleUrls: ['./food-listing-dialog-contents.component.css', '../food-listings.component.css']
})
export class FoodListingDialogContentsComponent {

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


    public constructor()
    { }
}
