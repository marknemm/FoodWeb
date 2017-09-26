import { Component, Input } from '@angular/core';
import { FoodListing } from '../../../../../shared/food-listings/food-listing';


@Component({
    selector: 'base-food-listing-info',
    templateUrl: './base-food-listing-info.component.html',
    styleUrls: ['./base-food-listing-info.component.css']
})
export class BaseFoodListingInfoComponent {

    @Input() private foodListing: FoodListing;
}
