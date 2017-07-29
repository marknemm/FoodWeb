import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class LogoutService {

  constructor(
    private http: Http,
    private router: Router
  ) {}

  public logout(): void {
    sessionStorage.clear();
    this.http.get('/authentication/logout')
    this.router.navigate([ '/home' ]);
    // Not interested in the response...
  }

}
