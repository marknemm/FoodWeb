import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { SignupRequest } from "../../../../../shared/authentication/signup-message";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";
import { AuthSessionService } from "../misc/auth-session.service";


@Injectable()
export class SignupService {

    constructor(
        private http: Http,
        private authSessionService: AuthSessionService
    ) { }

    signup(appUserSignupInfo: AppUserInfo, password: string) {
        var headers = new Headers({
            'Content-Type': 'application/json'
        });

        var observer: Observable<Response> = this.http.post('/authentication/signup', new SignupRequest(appUserSignupInfo, password), { headers: headers })
        return observer.map((response: Response): FoodWebResponse => {
            let signupResponse: FoodWebResponse = response.json();
            console.log(signupResponse.message);

            // On successful signup, cache the App User's data in global front end session storage.
            if (signupResponse.success) {
                this.authSessionService.updateAppUserSessionInfo(appUserSignupInfo);
            }

            return signupResponse;
        });
    }
}
