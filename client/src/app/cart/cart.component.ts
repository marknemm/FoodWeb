import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs/Observable";

import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";
import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { ClaimFoodListingService } from "../food-listings/claim-unclaim-food-listing.service";
import { AddRemoveFoodListingService } from "../food-listings/add-remove-food-listing.service";
import { SessionDataService } from '../common-util/session-data.service';

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters, LISTINGS_STATUS } from "../../../../shared/food-listings/food-listings-filters";
import { AppUserInfo } from "../../../../shared/authentication/app-user-info";


@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    providers: [
        SessionDataService,
        ClaimFoodListingService,
        AddRemoveFoodListingService
    ]
})
export class CartComponent implements OnInit {

    // Need to declare LISTINGS_STATUS enum inside component to be used in the HTML template!
    private readonly LISTINGS_STATUS: typeof LISTINGS_STATUS = LISTINGS_STATUS;
    private isDonorAndReceiver: boolean;

    @ViewChild('foodListingsFilters') private foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') private foodListingsComponent: FoodListingsComponent;


    constructor(
        private sessionDataService: SessionDataService,
        private claimFoodListingService: ClaimFoodListingService,
        private addRemoveFoodListingService: AddRemoveFoodListingService
    ) { }


    ngOnInit() {
        const appUserInfo: AppUserInfo = this.sessionDataService.getAppUserSessionData();

        /**
         *  Retrieves user data from session storage to 
         *  determine initial cart type and mutability of cart type
         */
        this.isDonorAndReceiver = (appUserInfo.isReceiver && appUserInfo.isDonor);
        if (appUserInfo.isReceiver) {
            // If both receiver and donor, then default to receiver mode!
            this.foodListingsFiltersComponent.addControl('listingsStatus', new FormControl(LISTINGS_STATUS.myClaimedListings));
        } 
        else {
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
        return (this.isClaimedCart() ? 'Claimed Food'
                                     : 'Donated Food');
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
        let observer: Observable<void> = this.addRemoveFoodListingService.removeFoodListing(selectedFoodListing.foodListingKey);

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
