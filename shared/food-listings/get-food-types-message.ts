import { FoodWebResponse } from '../message-protocol/food-web-response';


// No request since this message does not require a request payload.


/**
 * The expected response from the server after the get food types operation.
 */
export class GetFoodTypesResponse extends FoodWebResponse {

    constructor(
        /**
         * A list of food types retrieved on the server.
         */
        public foodTypes?: string[],
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        public success?: boolean,
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        public message?: string,
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        public loginRequired: boolean = false,
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        public signupConfirmRequired: boolean = false
    ) {
        super(success, message, loginRequired, signupConfirmRequired);
    }
}