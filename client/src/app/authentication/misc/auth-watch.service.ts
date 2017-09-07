import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { DialogService } from "ng2-bootstrap-modal";

import { AuthSessionService } from "./auth-session.service";
import { LoginComponent } from '../login/login.component'

import { LoginResponse } from "../../../../../shared/authentication/login-message";


/**
 * Re-authenticates the user whenever there is a route change. Also, makes a user login if they visit restricted routes which require login.
 */
@Injectable()
export class AuthWatchService implements CanActivate {


    /**
     * List of login restricted routes. User must be logged in to visit these pages!
     */
    private static readonly LOGIN_RESTRICTED_ROUTES: string[] = ['/donate', '/appUserInfo', '/cart'];


    constructor(
        private http: Http,
        private router: Router,
        private dialogService: DialogService,
        private authSessionService: AuthSessionService
    ) { }


    /**
     * Determines if a given target route can be activated (or followed). Will check credentials on server regardless of whether or not
     * the given route is in the LOGIN_RESTRICTED_ROUTES list.
     * @param route The route that is being activated.
     * @param state The state of the router.
     * @return An observable that will resolve to true if the route can be activated, and false if it cannot.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // Check with server to check if we are logged in!
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let observer: Observable<Response> = this.http.get('/authentication/reAuthenticate')

        // Finally, check the response from the server and react appropriately.
        return observer.map((response: Response): boolean => {
            let reAuthenticateResponse: LoginResponse = response.json();
            console.log(reAuthenticateResponse.message);

            // Make sure we update the session info we are holding.
            this.authSessionService.updateAppUserSessionInfo(reAuthenticateResponse.appUserInfo);

            // If not authenticated, and we are visiting a route that requires us to be logged in, then redirect to login.
            if (!reAuthenticateResponse.success && AuthWatchService.LOGIN_RESTRICTED_ROUTES.indexOf(state.url) >= 0) {
                this.attemptLoginAndRedirect(state.url);
                return false;
            }
            return true;
        });
    }


    /**
     * Generates a login dialog that the user can login with. If login is successful, then the user is redirected to their original target route.
     * @param toUrl THe url that the user was trying to access before reAuthentication.
     */
    private attemptLoginAndRedirect(toUrl: string): void {
        // Generate the login dialog.
        let dialogObserver: Observable<boolean> = LoginComponent.display(this.dialogService);

        // Observe what the dialog result is.
        dialogObserver.subscribe(() => {
            // After done with login dialog, if we are logged in, then we can redirect to original intended link!
            if (this.authSessionService.sessionInfoAvailable()) {
                this.router.navigate([toUrl]);
            }
        });
    }
}
