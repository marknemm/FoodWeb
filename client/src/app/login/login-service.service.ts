import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }
 
  login(username: string, password: string) {
    var observer : Observable<Response> = this.http.post('/login', JSON.stringify({ username: username, password: password }))
    return observer.map((response: Response) =>
      {
        // login successful if there's a jwt token in the response
        let user = response.json();
        if (user && user.email) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', user.email);
            console.log('Got email respons: ' + user.email);
        }

        return user.email;
      }
    );
  }
 
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
