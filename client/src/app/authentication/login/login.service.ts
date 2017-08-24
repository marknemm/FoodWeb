import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LoginModel } from './login-model'
import { AuthSessionService } from '../misc/auth-session.service';

import { LoginRequest, LoginResponse } from '../../../../../shared/authentication/login-message';
import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";


@Injectable()
export class LoginService {

    constructor(
        private http: Http,
        private authSessionService: AuthSessionService
    ) { }

    public login(loginModel: LoginModel): any {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let observer: Observable<Response> = this.http.post('/authentication/login', new LoginRequest(loginModel.username, loginModel.password), { headers: headers })
        return observer.map((response: Response): any /* AppUserInfo */ => {
            let loginResponse: LoginResponse = response.json();
            console.log(loginResponse.message);

            if (loginResponse.success) {
                this.authSessionService.updateAppUserSessionInfo(loginResponse.appUserInfo);
            }

            return { success: loginResponse.success, message: loginResponse.message };

            // TODO: Update this to use the new shared framework!
            /*if (loginResponse.success) {
                return loginResponse.appUserInfo;
            }
            throw new Error(loginResponse.message);*/
        });
    }

}
