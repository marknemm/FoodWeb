import { FoodListingsFilters, NgbDateStruct } from '../food-listings/food-listings-filters';
export { FoodListingsFilters, NgbDateStruct };

/**
 * Defines a common data type that should be sent from the client and received by the server for a get food listings request.
 */
export class GetFoodListingsRequest {

    constructor(
        /**
         * The (search) filters used when getting a segment of food listings from the server.
         */
        public filters: FoodListingsFilters
    ) { }
}