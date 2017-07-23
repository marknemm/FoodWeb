import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoginModel } from './login-model'

@Injectable()
export class LoginService {

  constructor(private http: Http) { }
  
  login(loginModel: LoginModel) {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var observer : Observable<Response> = this.http.post('/authentication/login', JSON.stringify(loginModel), {headers: headers})
    return observer.map((response : Response) => { return response.json(); });
  }

}
