import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LoginModel } from './login-model'
import { SessionDataService } from '../../common-util/session-data.service';

import { LoginRequest, LoginResponse } from '../../../../../shared/authentication/login-message';
import { RecoverPasswordRequest } from '../../../../../shared/authentication/login-message';
import { RecoverPasswordResponse } from '../../../../../shared/authentication/login-message';
import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";


@Injectable()
export class LoginService {

    constructor(
        private http: Http,
        private sessionDataService: SessionDataService
    ) { }

    public login(loginModel: LoginModel): Observable<{ success: boolean, message: string}> {

        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        // NOTE: Should user raw http request here instead of RequestService wrapper since RequestService depends on this LoginService (prevent circular dependency)!
        let observer: Observable<Response> = this.http.post('/authentication/login', new LoginRequest(loginModel.username, loginModel.password), { headers: headers })

        return observer.map((response: Response): any /* AppUserInfo */ => {
            
            let loginResponse: LoginResponse = response.json();
            console.log(loginResponse.message);

            if (loginResponse.success) {
                this.sessionDataService.updateAppUserSessionData(loginResponse.appUserInfo);
            }

            return { success: loginResponse.success, message: loginResponse.message };
        });
    }

  recoverPassword(loginModel: LoginModel){
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let observer : Observable<Response> = this.http.post('/authentication/recoverPassword', new RecoverPasswordRequest(loginModel.email), {headers: headers})
    return observer.map((response : Response): any =>{
      let recoverPasswordResponse: RecoverPasswordResponse = response.json();
      console.log(recoverPasswordResponse.message);

      return { success: recoverPasswordResponse.success, message: recoverPasswordResponse.message };

    })

  }

}
