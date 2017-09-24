/**
 * A single Food Listing entry that mainly contains data that is relavent to the user when browsing food listings.
 */
export class FoodListing {

    constructor(
        public foodListingKey?: number,
        public foodTitle?: string,
        public donorOrganizationName?: string,
        public donorOrganizationAddress?: string,
        public donorOrganizationCity?: string,
        public donorOrganizationState?: string,
        public donorOrganizationZip?: number,
        public donorLastName?: string,
        public donorFirstName?: string,
        /**
         * The distance of the donor from the receiver that is browsing the food listings.
         */
        public donorDistance?: number,
        public foodTypes?: string[],
        public foodDescription?: string,
        public perishable?: boolean,
        /**
         * The date until the Food Listing expires of the format mm/dd/yyyy
         */
        public availableUntilDate?: string,
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        public imgUrl?: string
    ) { }
}
