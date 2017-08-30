import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthSessionService } from './auth-session.service';

@Injectable()
export class LogoutService {

    constructor(
        private http: Http,
        private router: Router,
        private authSessionService: AuthSessionService,
    ) { }

    public logout(): void {
        this.http.get('/authentication/logout').subscribe(() => {
            this.authSessionService.clearSessionInfo();
            this.router.navigate(['/home']);
        });
        // Not interested in the response...
    }
}
