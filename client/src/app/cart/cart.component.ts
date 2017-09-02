import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs/Observable";

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters, LISTINGS_STATUS } from "../../../../shared/food-listings/food-listings-filters";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { ClaimFoodListingService } from "../food-listings/claim-food-listing.service";
import { AuthSessionService } from "../authentication/misc/auth-session.service";
import { AppUserInfo } from "../../../../shared/authentication/app-user-info";


@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    providers: [AuthSessionService, ClaimFoodListingService]
})
export class CartComponent implements OnInit {

    // Need to declare LISTINGS_STATUS enum inside component to be used in the HTML template!
    private readonly LISTINGS_STATUS: typeof LISTINGS_STATUS = LISTINGS_STATUS;

    @ViewChild('foodListingsFilters') private foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') private foodListingsComponent: FoodListingsComponent;


    constructor(
        private authSessionService: AuthSessionService,
        private claimFoodListingService: ClaimFoodListingService
    ) { }


    ngOnInit() {
        let appUserInfo: AppUserInfo = this.authSessionService.getAppUserSessionInfo();

        /**
         *  Retrieves user data from session storage to 
         *  determine initial cart type and mutability of cart type
         */
        if (appUserInfo.isReceiver) {
            // If both receiver and donor, then default to receiver mode!
            this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myClaimedListings));
        }
        else if (appUserInfo.isDonor) {
            this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myDonatedListings));
        }
    }


    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    ngAfterViewInit() {
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
    }


    private getFoodListingsTitle(): string {
        if (this.isClaimedCart()) {
            return 'Claimed Food';
        }
        return 'Donated Food';
    }


    private isClaimedCart(): boolean {
        return (this.foodListingsFiltersComponent.getFilterValues().listingsStatus === LISTINGS_STATUS.myClaimedListings);
    }


    private isDonatedCart(): boolean {
        return (this.foodListingsFiltersComponent.getFilterValues().listingsStatus === LISTINGS_STATUS.myDonatedListings);
    }


    private unclaimSelectedFoodListing(): void {
        if (confirm('Are you sure you want to unclaim the food?\nThis cannot be undone.')) {
            let selectedFoodListing: FoodListing = this.foodListingsComponent.getSelectedFoodListing();
            let observer: Observable<void> = this.claimFoodListingService.unclaimFoodListing(selectedFoodListing.foodListingKey);

            observer.subscribe(
                () => {
                    this.foodListingsComponent.removeSelectedFoodListing();
                },
                (err: Error) => {
                    console.log(err);
                }
            );
        }
    }


    private removeSelectedFoodListing(): void {
        let selectedFoodListing: FoodListing = this.foodListingsComponent.getSelectedFoodListing();
        /*let observer: Observable<void> = this.claimFoodListingService.claimFoodListing(selectedFoodListing.foodListingKey);

        observer.subscribe(
            () => {
                this.foodListingsComponent.removeSelectedFoodListing();
            },
            (err: Error) => {
                console.log(err);
            }
        );*/
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
