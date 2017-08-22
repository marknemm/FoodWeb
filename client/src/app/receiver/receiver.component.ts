import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";
import { FoodListingsComponent } from "../food-listings/food-listings.component";
import { FoodListingsFiltersComponent } from "../food-listings/food-listings-filters/food-listings-filters.component";

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
