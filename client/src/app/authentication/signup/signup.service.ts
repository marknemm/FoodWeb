import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignupModel } from './signup-model';

@Injectable()
export class SignupService {

  constructor(private http: Http) { }

  signup(signupModel: SignupModel) {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var observer : Observable<Response> = this.http.post('/authentication/signup', JSON.stringify(signupModel), {headers: headers})
    return observer.map((response : Response) => {
      return response.json();
    });
  }

  

}
