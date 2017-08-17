import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { SignupRequest } from "../../../../../shared/authentication/signup-message";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";


@Injectable()
export class SignupService {

    constructor(private http: Http) { }

    signup(appUserSignupInfo: AppUserInfo) {
        var headers = new Headers({
            'Content-Type': 'application/json'
        });

        var observer: Observable<Response> = this.http.post('/authentication/signup', new SignupRequest(appUserSignupInfo), { headers: headers })
        return observer.map((response: Response): FoodWebResponse => {
            let signupResponse: FoodWebResponse = response.json();
            console.log(signupResponse.message);
            return signupResponse;
        });
    }
}
