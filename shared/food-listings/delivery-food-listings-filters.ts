/**
 * A basic container for Food Listing Delivery filter data that may be sent to/from the server/client.
 */
export class DeliveryFoodListingsFilters {


    constructor(
        /**
         * Determines whether or not we will only pull back listings that are avaialble now (implies we ignore match availability).
         */
        //public availableNow?: boolean,
        /**
         * Determines the maximum distance (mi) from the requesting entity that donations must fall within.
         */
        public maxDistance?: number,
        /**
         * The maximum total weight of the delivery.
         */
        public maxTotalWeight?: number,
        /**
         * Determines the offset used when retrieving a limited segment of food listings.
         */
        public retrievalOffset?: number,
        /**
         * Determines the number of food listings that will be contained in the limited segment of retrievals.
         */
        public retrievalAmount?: number,
        /**
         * Determines if we should only retrieve Delivery Food Listings that have been established for this deliverer (Deliver Cart).
         */
        public myScheduledDeliveries?: boolean
        /**
         * Determines whether or not we should only pull back deliveries for Donors and Receivers whose availablility times match the logged in deliverer's times.
         */
        //public matchAvailability?: boolean
    ) { }
}
