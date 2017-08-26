import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LoginModel } from './login-model'

import { LoginRequest, LoginResponse } from '../../../../../shared/authentication/login-message';
import { RecoverPasswordRequest } from '../../../../../shared/authentication/login-message';
import { RecoverPasswordResponse } from '../../../../../shared/authentication/login-message';
import { AppUserInfo } from "../../../../../shared/authentication/app-user-info";


@Injectable()
export class LoginService {

  constructor(private http: Http) { }
  
  login(loginModel: LoginModel) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let observer : Observable<Response> = this.http.post('/authentication/login', new LoginRequest(loginModel.username, loginModel.password), {headers: headers})
    return observer.map((response : Response): any /* AppUserInfo */ => {
        let loginResponse: LoginResponse = response.json();
        console.log(loginResponse.message);

        return { success: loginResponse.success, message: loginResponse.message, username: loginResponse.appUserInfo.email, appUserKey: loginResponse.appUserInfo.appUserKey };

        // TODO: Update this to use the new shared framework!
        /*if (loginResponse.success) {
            return loginResponse.appUserInfo;
        }
        throw new Error(loginResponse.message);*/
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
