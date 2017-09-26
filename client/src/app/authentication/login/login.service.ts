import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionDataService } from '../../common-util/session-data.service';

import { LoginRequest, LoginResponse } from '../../../../../shared/authentication/login-message';
import { FoodWebResponse } from '../../../../../shared/message-protocol/food-web-response';


@Injectable()
export class LoginService {

    constructor(
        private http: Http,
        private sessionDataService: SessionDataService
    ) { }


    /**
     * Performs the login operation by contacting the server.
     * NOTE: Also, sets all associated session data on successful login.
     * @param email The email of the user that is logging in.
     * @param password The password of the user that is logging in.
     * @return An observable that will resolve to a Food Web Response object that pertains success or failure data pertaining to the login operation.
     */
    public login(email: string, password: string): Observable<FoodWebResponse> {

        const requestOptions: RequestOptionsArgs = {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        // NOTE: Should user raw http request here instead of RequestService wrapper since RequestService depends on this LoginService (prevent circular dependency)!
        let observer: Observable<Response> = this.http.post('/authentication/login', new LoginRequest(email, password), requestOptions);

        return observer.map((response: Response): any /* AppUserInfo */ => {

            let loginResponse: LoginResponse = response.json();
            console.log(loginResponse.message);

            if (loginResponse.success) {
                this.sessionDataService.updateAppUserSessionData(loginResponse.appUserInfo);
            }

            return (loginResponse as FoodWebResponse);
        });
    }
}
