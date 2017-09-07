import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DialogService } from "ng2-bootstrap-modal";

import { AuthSessionService } from "../authentication/misc/auth-session.service";
import { LoginComponent } from '../authentication/login/login.component'

import { FoodWebResponse } from "../../../../shared/message-protocol/food-web-response";


@Injectable()
export class RequestService {

    constructor(
        private http: Http,
        private dialogService: DialogService,
        private authSessionService: AuthSessionService
    ) { }


    /**
     * Performs an HTTP POST Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     * @param body The body or payload of the request. This will be sent in JSON format.
     */
    public post(url: string, body: any): Observable<any> {
        // Wrap the request in a function so that it can recursively be called by response handler if necessary.
        let sendRequest = function(): Observable<any> {
            let options: RequestOptionsArgs = {
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };

            return this.http.post(url, body, options).map(
                this.handleResponse.bind(this, sendRequest)
            );
        }

        return sendRequest();
    }


    /**
     * Performs an HTTP GET Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     */
    public get(url: string): Observable<any> {
        // Wrap the request in a function so that it can recursively be called by response handler if necessary.
        let sendRequest = function(): Observable<any> {
            return this.http.get(url).map(
                this.handleResponse.bind(this, sendRequest)
            );
        }

        return sendRequest();
    }


    /**
     * Handles the response of either an HTTP POST or GET request. Determines if re-login is required and acts accordingly.
     * @param response The response of either an HTTP POST or GET request.
     */
    private handleResponse(retrySendRequestCallback: () => Observable<any>, response: Response): Observable<any | FoodWebResponse> {
        let foodWebResponse: FoodWebResponse = response.json();

        // Check if the user must confirm their signup in order to successfully perform the related request/action.
        if (foodWebResponse.signupConfirmRequired) {
            alert('Sorry, you must confirm your registration by following the email confirmation link sent to your email account before performing this action.');
        }
        // Check if the user must login in order to successfully perform the related request/action.
        else if (foodWebResponse.loginRequired) {
            // Mark the session ended (or not logged in) in this client.
            this.authSessionService.clearSessionInfo();

            return LoginComponent.display(this.dialogService).map((): Observable<any | FoodWebResponse> => {
                // If login successful, then re-send original request and go through this process recursively.
                if (this.authSessionService.sessionInfoAvailable()) {
                    retrySendRequestCallback();
                }

                // Else login not successful so simply return original response with error information.
                return Observable.of(foodWebResponse);
            })
        }

        // No problems with signup confirmation or login detected!
        return Observable.of(foodWebResponse);
    }
}
