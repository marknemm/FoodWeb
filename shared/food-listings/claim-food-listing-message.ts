/**
 * The expected request for the claim food listings operation. Should be sent from the client to the server.
 */
export class ClaimFoodListingRequest {

    constructor(
        /**
         * The key identifier of the Food Listing to be claimed.
         */
        public foodListingKey: number
    ) { }
}
