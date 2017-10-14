import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";

import { AbstractSlickList } from './../slick-list/abstract-slick-list';
import { SlickListDialogComponent } from '../slick-list/slick-list-dialog/slick-list-dialog.component';
//import { FoodListingDialogContentsComponent } from './food-listing-dialog-contents/food-listing-dialog-contents.component';
import { GetFoodListingsService } from './food-listing-services/get-food-listings.service';

import { FoodListing } from '../../../../shared/food-listings/food-listing';
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";
import { GetFoodListingsRequest } from '../../../../shared/food-listings/get-food-listings-message';


@Component({
    selector: 'app-food-listings',
    templateUrl: './food-listings.component.html',
    styleUrls: ['./food-listings.component.css'],
    providers: [GetFoodListingsService]
})
export class FoodListingsComponent extends AbstractSlickList <FoodListing, FoodListingsFilters> {

    /**
     * Title of the Food Listings. Default is 'Food Listings'.
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

    @ViewChild('SlickListDialogComponent') protected slickListDialog: SlickListDialogComponent;


    public constructor (
        getFoodListingsService: GetFoodListingsService
    ) {
        super(getFoodListingsService, '/foodListings/getFoodListings');
    }
}
