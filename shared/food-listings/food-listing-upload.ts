import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";


/**
 * A container for holding data used in the upload of a new food listing.
 */
export class FoodListingUpload {
    
        constructor(
            public foodListingKey?: number,
            /**
             * The appUserKey of the donor. The server will fill this value. No need to fill it at the client.
             */
            public donorAppUserKey?: number,
            public foodTypes?: string[],
            public foodDescription?: string,
            public perishable?: boolean,
            /**
             * Expiration date of the format mm/dd/yyyy
             */
            public expirationDate?: NgbDateStruct,
            /**
             * The string representation of the image associated with the listing.
             * Should only be populated for the addition or upload of a new Food Listing.
             */
            public imageUpload?: string,
            /**
             * The name of the image. Optional to be filled by client.
             * The server will add to it to ensure that it is unique, or auto-generate it if it is empty.
             */
            public imageName?: string
        ) { }
    }