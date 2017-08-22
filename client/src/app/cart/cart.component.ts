import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { FoodListing } from "../../../../shared/food-listings/food-listing";
import { FoodListingsFilters } from "../../../../shared/food-listings/food-listings-filters";
import { FoodListingsComponent } from "../food-listings/food-listings.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private selectedFoodListing: FoodListing;
  private cartType: FoodListingsFilters;

  @ViewChild('foodListings') foodListingsComponent: FoodListingsComponent;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    //this.foodListingsComponent.refreshFoodListings();
  }

  //Replace Modal Buttons For Cart
  private selectItem(content, value: FoodListing): void {
        this.selectedFoodListing = value;
        this.modalService.open(content).result.then((result) => {
            if (result === "Finalize click") {
                //Send Status Change to Back End
            }
            else if (result === "Remove click") {
                //Send Request to Remove From Cart
            }
        })
    }
}
