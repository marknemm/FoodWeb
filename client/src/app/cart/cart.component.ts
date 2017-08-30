import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";
import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { AuthSessionService } from "../authentication/misc/auth-session.service";
import { AppUserInfo } from "../../../../shared/authentication/app-user-info";


@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    providers: [AuthSessionService]
})
export class CartComponent implements OnInit {

    private cartType: FoodListingsFilters = { myClaimedListings: false, myDonatedListings: false };
    private newTitle: string = "Please sign in to view your cart...";
    private setReceiverFlag: boolean;
    private setDonorFlag: boolean;

    @ViewChild('foodListings') foodListingsComponent: FoodListingsComponent;

    constructor(
        private authSessionService: AuthSessionService
    ) { }

    ngOnInit() {
        if (this.authSessionService.sessionInfoAvailable()) {
            let appUserInfo: AppUserInfo = this.authSessionService.getAppUserSessionInfo();

            /**
             *  Retrieves user data from session storage to 
             *  determine initial cart type and mutability of cart type
             */
            if (appUserInfo.isReceiver && appUserInfo.isDonor) {
                this.setReceiverMode();
                this.setDonorFlag = true;
            }
            else if (appUserInfo.isDonor) {
                this.setDonorMode();
            }
            else if (appUserInfo.isReceiver) {
                this.setReceiverMode();
            }
        }
    }

    // Builds cart to display claimed listings
    private setReceiverMode() {
        this.cartType.myClaimedListings = true;
        this.cartType.myDonatedListings = false;
        // Simple logic to determine button visibility (id: btn-set-claimed)
        if (this.setReceiverFlag) {
            this.setDonorFlag = true;
            this.setReceiverFlag = false;
        }
        this.newTitle = "Selected Listings";
        this.foodListingsComponent.refreshFoodListings(this.cartType);
    }

    // Builds cart to display donated listings
    private setDonorMode() {
        this.cartType.myDonatedListings = true;
        this.cartType.myClaimedListings = false;
        // Simple logic to determine button visibility (id: btn-set-posted)
        if (this.setDonorFlag) {
            this.setReceiverFlag = true;
            this.setDonorFlag = false;
        }
        this.newTitle = "Posted Listings";
        this.foodListingsComponent.refreshFoodListings(this.cartType);
    }

    // Changes status of listings in a use cart through left panel buttons or modal buttons
    private mutateListingStatus(singleListingFlag: boolean, upgradeListingFlag: boolean) {
        let selectedFoodListings: FoodListing[];
        if (singleListingFlag) {
            // For changing the status of only one listing (via modal button)
            selectedFoodListings = [this.foodListingsComponent.getSelectedFoodListing()];
        }
        else {
            // For changing the status of all cart listings (via left panel button)
            selectedFoodListings = this.foodListingsComponent.getDisplayedListings();
        }
        if (upgradeListingFlag) {
            // Send chosen food listings to backend for status upgrade
        }
        else {
            // Send chosen food listings to backend for status downgrade
        }
    }
}
