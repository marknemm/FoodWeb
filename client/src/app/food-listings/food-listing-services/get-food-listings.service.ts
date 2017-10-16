"use strict";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GetListingsService } from '../../slick-list/get-listings.service';
import { RequestService } from '../../common-util/request.service';

import { FoodListingsFilters, GetFoodListingsRequest } from '../../../../../shared/food-listings/message/get-food-listings-message';
import { FoodListing } from '../../../../../shared/food-listings/food-listing';


@Injectable()
export class GetFoodListingsService extends GetListingsService<FoodListing, FoodListingsFilters> {
    
    public constructor (
        requestService: RequestService
    ) {
        super(requestService);
    }


    /**
     * Abstract method that should be overriden by child class. Generates the final request object that will be JSON-ified and sent to the server.
     * The request object must either e SlickListRequest or by a subclass of it.
     * @param filters The filter criteria used when retrieving listings.
     * @return The final request that will be sent to the server.
     */
    protected generateListingsRequest(filters: FoodListingsFilters): GetFoodListingsRequest {
        return new GetFoodListingsRequest(filters);
    }
}
