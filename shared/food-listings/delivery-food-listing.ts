import { FoodListingUser, FoodListingUnits } from './food-listing';


/**
 * A single Food Listing Delivery entry that mainly contains data that is relavent to the user when browsing potential deliveries.
 */
export class DeliveryFoodListing {

    constructor (
        public claimedFoodListingKey?: number,
        public deliveryFoodListingKey?: number,
        public foodTitle?: string,
        public foodDescription?: string,
        public perishable?: boolean,
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        public imgUrl?: string,
        /**
         * The total weight of the delivery (in lbs).
         */
        public totalWeight?: number,
        public donorInfo?: FoodListingUser,     // Driving distance and time here is from driver to donor!
        public receiverInfo?: FoodListingUser,  // Driving distance and time here is from donor to receiver!
        public unitsInfo?: FoodListingUnits
    ) { }
}
