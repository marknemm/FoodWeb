/**
 * A single Food Listing Delivery entry that mainly contains data that is relavent to the user when browsing potential deliveries.
 */
export class DeliveryFoodListing {

    constructor(
        public claimedFoodListingKey?: number,
        public deliveryFoodListingKey?: number,
        public foodTitle?: string,
        public donorOrganizationName?: string,
        public donorAddress?: string,
        public donorCity?: string,
        public donorState?: string,
        public donorZip?: number,
        /**
         * The driving distance of the deliverer from the donor.
         */
        public donorDrivingDistance?: number,
        /**
         * The time that it will take 
         */
        public donorDrivingTime?: number,
        public donorPhone?: string,
        public donorLastName?: string,
        public donorFirstName?: string,
        public receiverOrganizationName?: string,
        public receiverAddress?: string,
        public receiverCity?: string,
        public receiverState?: string,
        public receiverZip?: number,
        /**
         * The driving distance of the receiver from the donor.
         */
        public receiverDrivingDistance?: number,
        /**
         * The time (in minutes) that it will take to get from Donor to Receiver.
         */
        public receiverDrivingTime?: number,
        public receiverPhone?: string,
        public receiverLastName?: string,
        public receiverFirstName?: string,
        public foodDescription?: string,
        public perishable?: boolean,
        /**
         * The date until the Food Listing expires of the format mm/dd/yyyy
         */
        public availableUntilDate?: string,
        /**
         * The number of claimed units to be delivered.
         */
        public claimedUnitsCount?: number,
        /**
         * The user given label for the units that the Food Listing has been split into (e.g. cans, bottles, lbs, etc).
         */
        public unitsLabel?: string,
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        public imgUrl?: string,
        /**
         * The total weight of the delivery (in lbs).
         */
        public totalWeight?: number
    ) { }
}
