import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export { NgbDateStruct };


/**
 * An emumeration of different food listing statuses to filter on.
 */
export enum LISTINGS_STATUS {
    unclaimedListings,
    myClaimedListings,
    myDonatedListings
};


/**
 * A basic container for Food Listing filter data that may be sent to/from the server/client.
 */
export class FoodListingsFilters {


    constructor(
        /**
         * Determines what food types the results should contain.
         */
        public foodTypes?: string[],
        /**
         * Determines if results should include perishable elements.
         */
        public perishable?: boolean,
        /**
         * Determines if results should include non-perishable elements.
         */
        public notPerishable?: boolean,
        /**
         * Determines the minimum date that retrieved items may expire after.
         */
        public earliestExpireDate?: NgbDateStruct,
        /**
         * Determines the maximum distance from the requesting entity that donations must fall within.
         */
        public maxDistance?: number,
        /**
         * Determines the offset used when retrieving a limited segment of food listings.
         */
        public retrievalOffset?: number,
        /**
         * Determines the number of food listings that will be contained in the limited segment of retrievals.
         */
        public retrievalAmount?: number,
        /**
         * Determines what food listings we should bring back based off of their status (unclaimed, claimed, or donated relative to the current user).
         */
        public listingsStatus: LISTINGS_STATUS = LISTINGS_STATUS.unclaimedListings
    ) { }
}
