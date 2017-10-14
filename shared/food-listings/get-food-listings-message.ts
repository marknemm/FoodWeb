import { FoodListingsFilters } from '../food-listings/food-listings-filters';
export { FoodListingsFilters };

import { FoodWebResponse } from '../message-protocol/food-web-response';
import { FoodListing } from "../food-listings/food-listing";
export { FoodListing };

import { SlickListRequest } from '../../client/src/app/slick-list/slick-list-message/slick-list-request';
import { SlickListResponse } from '../../client/src/app/slick-list/slick-list-message/slick-list-response';


/**
 * The expected request for the get food listings operation. Should be sent from the client to the server.
 */
export class GetFoodListingsRequest extends SlickListRequest<FoodListingsFilters> {

    constructor(
        /**
         * Filters to use when getting food listings.
         */
        public filters: FoodListingsFilters
    ) {
        super(filters);
    }
}


/**
 * The expected response from the get food listings operation. Should be sent form the server to the client.
 */
export class GetFoodListingsResponse extends SlickListResponse<FoodListing> {

    constructor(
        /**
         * The food listings that were retrieved during the server operation.
         */
        public dataList?: Array<FoodListing>,
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
        super(dataList, success, message, loginRequired, signupConfirmRequired);
    }
}
