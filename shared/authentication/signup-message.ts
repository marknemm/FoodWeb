import { FoodWebResponse } from '../message-protocol/food-web-response';
import { AppUserInfo } from './app-user-info';


/**
 * Contains data that should be sent during a signup request.
 */
export class SignupRequest {

    constructor(
        public appUserInfo: AppUserInfo
    ) { }
}

// No signup response necessary since all the necessary information was submitted from the front end (nothing needs to be sent back).
