import { Component, OnInit, Input, Output } from '@angular/core';

import { FoodListing } from './food-listing';
import { FoodListingsFilters } from "./food-listings-filters/food-listings-filters";
import { FoodListingsService } from "./food-listings.service";


@Component({
    selector: 'app-food-listings',
    templateUrl: './food-listings.component.html',
    styleUrls: ['./food-listings.component.css'],
    providers: [FoodListingsService]
})
export class FoodListingsComponent implements OnInit {

    @Input() title: string = 'Food Listings';

    private foodListings: FoodListing[];

    constructor(private foodListingsService: FoodListingsService) {}

    ngOnInit() {
        this.foodListings = [];
    }

    /**
     * Refreshes the food listings using the new set of filters criteria. The offset used to retreive a certain range of food listings will be
     * reset to 0.
     * @param filters The filter criteria. 
     */
    @Output()
    public refreshFoodListings(filters: FoodListingsFilters) {
        var observer = this.foodListingsService.getFoodListings(filters);

        observer.subscribe(data => {
            console.log(data.message);
            if (data.success) {
                this.foodListings = data.foodListings as FoodListing[];
            }
        });
    }
}
