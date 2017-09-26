import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RecoverPasswordRequest } from '../../../../../shared/authentication/password-recovery-message';
import { FoodWebResponse } from '../../../../../shared/message-protocol/food-web-response';


@Injectable()
export class PasswordRecoveryService {

    constructor(
        private http: Http
    ) { }


    /**
     * Recovers a user's password. The recovery process involves the user setting a new password.
     * @param email The email of the user that wishes to recover their password.
     * @return An observable object that contains data pertaining to the success or failure of the password recovery server operation.
     */
    public recoverPassword(email: string): Observable<FoodWebResponse> {

        const requestOptions: RequestOptionsArgs = {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };
        
        let observer: Observable<Response> = this.http.post('/authentication/recoverPassword', new RecoverPasswordRequest(email), requestOptions);

        return observer.map((response: Response): any => {
            
            let recoverPasswordResponse: FoodWebResponse = response.json();
            console.log(recoverPasswordResponse.message);

            return recoverPasswordResponse;
        });
    }
}
