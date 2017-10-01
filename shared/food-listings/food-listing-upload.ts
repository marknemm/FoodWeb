/**
 * A container for holding data used in the upload of a new food listing.
 */
export class FoodListingUpload {

    constructor(
        /**
         * Primary identifier of the Food Listing if editing.
         */
        public foodListingKey?: number,
        /**
         * List of all contained Food Types.
         */
        public foodTypes?: string[],
        /**
         * Required (short) food description or title.
         */
        public foodTitle?: string,
        /**
         * Can the food listing spoil?
         */
        public perishable?: boolean,
        /**
         * Date that the donated Food Listing will no longer be available at (of the format mm/dd/yyyy)
         */
        public availableUntilDate?: Date,
        /**
         * Optional weight of entire Food Listing (in pounds).
         */
        public totalWeight?: number,
        /**
         * Optional (long) food description.
         */
        public foodDescription?: string,
        /**
         * The string representation of the image associated with the listing.
         * Should only be populated for the addition or upload of a new Food Listing.
         */
        public imageUpload?: string,
        /**
         * The total number of available units (parts) contained in the Food Listing.
         */
        public availableUnitsCount: number = 1,
        /**
         * The units label for the food listing.
         */
        public unitsLabel?: string
    ) { }
}
