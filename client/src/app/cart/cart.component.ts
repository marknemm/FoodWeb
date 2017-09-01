import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters, LISTINGS_STATUS } from "../../../../shared/food-listings/food-listings-filters";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
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

    private setReceiverFlag: boolean;
    private setDonorFlag: boolean;
    // Need to declare LISTINGS_STATUS enum inside component to be used in the HTML template!
    private readonly LISTINGS_STATUS: typeof LISTINGS_STATUS = LISTINGS_STATUS;

    @ViewChild('foodListingsFilters') private foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') private foodListingsComponent: FoodListingsComponent;


    constructor(
        private authSessionService: AuthSessionService
    ) { }


    ngOnInit() {
        let appUserInfo: AppUserInfo = this.authSessionService.getAppUserSessionInfo();

        /**
         *  Retrieves user data from session storage to 
         *  determine initial cart type and mutability of cart type
         */
        if (appUserInfo.isReceiver && appUserInfo.isDonor) {
            this.setReceiverAndDonorMode();
        }
        else if (appUserInfo.isDonor) {
            this.setDonorMode();
        }
        else if (appUserInfo.isReceiver) {
            this.setReceiverMode();
        }
    }


    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    ngAfterViewInit() {
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
    }


    private setReceiverAndDonorMode(): void {
        this.setReceiverFlag = true;
        this.setDonorFlag = true;
        this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myClaimedListings));
    }


    // Builds cart to display claimed listings
    private setReceiverMode(): void {
        // Simple logic to determine button visibility (id: btn-set-claimed)
        this.setDonorFlag = false;
        this.setReceiverFlag = true;
        this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myClaimedListings));
    }


    // Builds cart to display donated listings
    private setDonorMode(): void {
        // Simple logic to determine button visibility (id: btn-set-posted)
        this.setDonorFlag = true;
        this.setReceiverFlag = false;
        this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myDonatedListings));
    }


    private getFoodListingsTitle(): string {
        if (this.foodListingsFiltersComponent.getFilterValues().listingsStatus === LISTINGS_STATUS.myClaimedListings) {
            return 'Claimed Food';
        }
        return 'Donated Food';
    }


    // Changes status of listings in a use cart through left panel buttons or modal buttons
    private mutateListingStatus(singleListingFlag: boolean, upgradeListingFlag: boolean): void {
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
