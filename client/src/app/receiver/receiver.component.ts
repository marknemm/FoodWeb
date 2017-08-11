import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { FoodListing } from "../food-listings/food-listing";
import { FoodListingsFilters } from "../food-listings/food-listings-filters/food-listings-filters";
import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";

/*const FOOD_LISTINGS_MODEL: FoodListing[] = [
    {
        name: "Beef Stew",
        foodListingKey: 0,
        donorOrganizationName: "Stew's Stews",
        donorOrganizationAddress: "800 Beef Lane",
        donorOrganizationCity: "Williamsville",
        donorOrganizationState: "New York",
        donorOrganizationZip: 14221,
        donorLastName: "Stew",
        donorFirstName: "Steven",
        donorDistance: 6,
        foodTypeDescription: "Meat, Vegetable, Drink",
        foodDescription: "Quite the beefy stew...",
        preishable: true,
        expirationDate: "13/32/2017",
        quantityClass: "Car",
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    }
]*/

@Component({
    selector: 'app-receiver',
    templateUrl: './receiver.component.html',
    styleUrls: ['./receiver.component.css']
})
export class ReceiverComponent implements OnInit {
    
    private selectedFoodListing: FoodListing;
    private filtersForm: FormGroup;

    @ViewChild('foodListingsFilters') foodListingsFiltersComponent: FoodListingsFiltersComponent;
    @ViewChild('foodListings') foodListingsComponent: FoodListingsComponent;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal)
    {}

    ngOnInit() {
        // This is how you would add the code behind for additional filters specific to the receiver form.
        //this.foodListingsFiltersComponent.addControl('dummyControl', new FormControl('dummy control'));
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
    }

    private selectItem(content, value: FoodListing): void {
        //For viewing specifics and taking a listing down from the server
        this.selectedFoodListing = value;
        this.modalService.open(content).result.then((result) => {
            if (result === "Request click") {
                //Send item request to back end
            }
        })
    }
}
