import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService, Response } from '../../common-util/request.service';

import { UpdateAppUserRequest } from '../../../../../shared/authentication/update-app-user-message';
import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";
import { FoodWebResponse } from "../../../../../shared/message-protocol/food-web-response";


@Injectable()
export class AppUserUpdateService {

    constructor(
        private requestService: RequestService
    ) { }


    /**
     * Sends App User Update Info to the server and listens for a response.
     * @param appUserInfoUpdate Contains the update information. Any non-null values will be used to update App User information.
     * @param newPassword The password update.
     * @param currentPassword Only required when the password is being updated. Should contain the current password of the user.
     */
    public updateAppUserInfo(appUserInfoUpdate: AppUserInfo, newPassword?: string, currentPassword?: string): Observable<FoodWebResponse> {

        let body: UpdateAppUserRequest = new UpdateAppUserRequest(appUserInfoUpdate, newPassword, currentPassword);
        let observer: Observable<Response> = this.requestService.post('/authentication/updateAppUser', body);

        return observer.map((response: Response): FoodWebResponse => {
            let appUserUpdateResponse: FoodWebResponse = response.json();
            console.log(appUserUpdateResponse.message);

            // TODO: generate login popup if session ended and resend request upon login response.

            return appUserUpdateResponse;
        });
    }
}
