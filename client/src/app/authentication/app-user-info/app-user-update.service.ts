import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UpdateAppUserRequest } from '../../../../../shared/authentication/update-app-user-message';
import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";


@Injectable()
export class AppUserUpdateService {

    constructor(
        private http: Http
    ) { }


    /**
     * Sends App User Update Info to the server and listens for a response.
     * @param appUserInfoUpdate Contains the update information. Any non-null values will be used to update App User information.
     * @param currentPassword Only required when the password is being updated. Should contain the current password of the user.
     */
    public updateAppUserInfo(appUserInfoUpdate: AppUserInfo, currentPassword?: string): Observable<FoodWebResponse> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let observer: Observable<Response> = this.http.post('/authentication/updateAppUser',
                                                            new UpdateAppUserRequest(appUserInfoUpdate, currentPassword),
                                                            { headers: headers });

        return observer.map((response: Response): FoodWebResponse => {
            let appUserUpdateResponse: FoodWebResponse = response.json();
            console.log(appUserUpdateResponse.message);

            // TODO: generate login popup if session ended and resend request upon login response.

            return appUserUpdateResponse;
        });
    }
}
