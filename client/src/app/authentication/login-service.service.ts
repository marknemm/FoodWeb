import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }
 
  login(username : string, password : string) {
    console.log('username: ' + username);
    console.log('password: ' + password);
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var observer : Observable<Response> = this.http.post('/authentication/login', JSON.stringify({ username: username, password: password }), {headers: headers})
    return observer.map((response : Response) =>
      {
        let user = response.json();
        if (user && user.username) {
            console.log('Got login response: ' + user.username);
        }

        return user;
      }
    );
  }
 
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
