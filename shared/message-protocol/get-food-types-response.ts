import { FoodWebResponse } from './food-web-response';


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
         * Indicates if there is a need for the user to associate with a donor organization to perform the related operation on the server.
         */
        public donorRequired: boolean = false,
        /**
         * Indicates if there is a need for the user to associate with a receiver organization to perform the related operation on the server.
         */
        public receiverRequired: boolean = false
    ) {
        super(success, message, loginRequired, donorRequired, receiverRequired);
    }
}