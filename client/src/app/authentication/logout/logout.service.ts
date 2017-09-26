import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { RequestService } from "../../common-util/request.service";
import { SessionDataService } from '../../common-util/session-data.service';

@Injectable()
export class LogoutService {

    constructor(
        private router: Router,
        private requestService: RequestService,
        private sessionDataService: SessionDataService,
    ) { }

    public logout(): void {
        this.requestService.get('/authentication/logout').subscribe(() => {
            this.sessionDataService.clearSessionData();
            this.router.navigate(['/home']);
        });
        // Not interested in the response...
    }
}
