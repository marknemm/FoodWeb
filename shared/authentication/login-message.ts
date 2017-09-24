import { FoodWebResponse } from '../message-protocol/food-web-response';
import { AppUserInfo } from '../authentication/app-user-info';


export class LoginRequest {

    constructor(
        public email: string,
        public password: string
    ) { }
}


export class LoginResponse extends FoodWebResponse {

    constructor(
        /**
         * The shared info related to the App User that has successfully signed up.
         */
        public appUserInfo?: AppUserInfo,
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

export class RecoverPasswordRequest{
    constructor(
        public email: string
    ){}
}

export class RecoverPasswordResponse extends FoodWebResponse{
    constructor(
        public success?: boolean,

        public message?: string

    ){
        super(success, message);
    }
}