/**
 * A single Food Listing entry that mainly contains data that is relavent to the user when browsing food listings.
 */
export class FoodListing {

    constructor(
        public foodListingKey?: number,
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
        public quantityClass?: string,
        public perishable?: boolean,
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        public expirationDate?: string,
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        public imgUrl?: string,
        /**
         * The string representation of the image associated with the listing.
         * Should only be populated for the addition or upload of a new Food Listing.
         */
        public imageUpload?: string
    ) { }
}
