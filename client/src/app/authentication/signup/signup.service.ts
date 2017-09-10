import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService, Response } from "../../common-util/request.service";
import { SessionDataService } from "../../common-util/session-data.service";

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { SignupRequest } from "../../../../../shared/authentication/signup-message";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";


@Injectable()
export class SignupService {

    constructor(
        private requestService: RequestService,
        private sessionDataService: SessionDataService
    ) { }

    signup(appUserSignupInfo: AppUserInfo, password: string) {

        let body: SignupRequest = new SignupRequest(appUserSignupInfo, password);
        let observer: Observable<Response> = this.requestService.post('/authentication/signup', body);
        
        return observer.map((response: Response): FoodWebResponse => {
            
            let signupResponse: FoodWebResponse = response.json();
            console.log(signupResponse.message);

            // On successful signup, cache the App User's data in global front end session storage.
            if (signupResponse.success) {
                this.sessionDataService.updateAppUserSessionData(appUserSignupInfo);
            }

            return signupResponse;
        });
    }
}
