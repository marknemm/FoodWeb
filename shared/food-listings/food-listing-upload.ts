/**
 * A container for holding data used in the upload of a new food listing.
 */
export class FoodListingUpload {

    constructor(
        public foodListingKey?: number,
        public foodTypes?: string[],
        public foodDescription?: string,
        public perishable?: boolean,
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        public expirationDate?: Date,
        /**
         * The string representation of the image associated with the listing.
         * Should only be populated for the addition or upload of a new Food Listing.
         */
        public imageUpload?: string
    ) { }
}
