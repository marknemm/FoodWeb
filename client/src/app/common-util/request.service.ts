/* TODO: This file is a hell of a lot confusing... simplify in future. For now, just made lots of comments. */

import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DialogService } from "ng2-bootstrap-modal";

import { SessionDataService } from "../common-util/session-data.service";
import { LoginComponent } from '../authentication/login/login.component'

import { FoodWebResponse } from "../../../../shared/message-protocol/food-web-response";
import { Observer } from "rxjs/Observer";

export { Response };


/**
 * All requests made to the server should be processed through this service. There should be no raw http requests.
 * This service acts as client side middleware that checks the error state of the response to see if it can remedy the error
 * (like in cases where a login is required) and resend the request.
 */
@Injectable()
export class RequestService {

    constructor(
        private http: Http,
        private dialogService: DialogService,
        private sessionDataService: SessionDataService
    ) { }


    /**
     * Performs an HTTP POST Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     * @param body The body or payload of the request. This will be sent in JSON format.
     */
    public post(url: string, body: any): Observable<Response> {
        /* Wrap the request in a function so that it can recursively be called by response handler if necessary.
           Such cases would include when the user must login and they successfully login (repeat request). */
        let sendRequest = function(): Observable<Response> {
            let options: RequestOptionsArgs = {
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };

            return Observable.create((observer: Observer<Response>) => {
                this.http.post(url, body, options).subscribe((response: Response) => {

                    // Make the response handler its own Observable because it can evaluate to a recursive call to sendRequest()!
                    this.handleResponse(sendRequest, response).subscribe((response: Response) => {
                        observer.next(response);
                        observer.complete();
                    });
                });
            });
        }
        .bind(this);

        return sendRequest();
    }


    /**
     * Performs an HTTP GET Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     */
    public get(url: string): Observable<Response> {
        /* Wrap the request in a function so that it can recursively be called by response handler if necessary.
           Such cases would include when the user must login and they successfully login (repeat request). */
        let sendRequest = function(): Observable<Response> {

            return Observable.create((observer: Observer<Response>) => {
                this.http.get(url).subscribe((response: Response) => {
                    
                    // Make the response handler its own Observable because it can evaluate to a recursive call to sendRequest()!
                    this.handleResponse(sendRequest, response).subscribe((response: Response) => {
                        observer.next(response);
                        observer.complete();
                    });
                });
            });
        }
        .bind(this);

        return sendRequest();
    }


    /**
     * Handles the response of either an HTTP POST or GET request. Determines if re-login is required and acts accordingly.
     * @param retrySendRequestCallback A callback function that may be called to recursively retry the request.
     * @param response The response of either an HTTP POST or GET request.
     */
    private handleResponse(retrySendRequestCallback: () => Observable<Response>, response: Response): Observable<Response> {
        let foodWebResponse: FoodWebResponse = response.json();

        // Check if the user must confirm their signup in order to successfully perform the related request/action.
        if (foodWebResponse.signupConfirmRequired) {
            alert('Sorry, you must confirm your registration by following the email confirmation link sent to your email account before performing this action.');
        }
        // Check if the user must login in order to successfully perform the related request/action.
        else if (foodWebResponse.loginRequired) {
            // Mark the session ended (or not logged in) in this client.
            this.sessionDataService.clearSessionData();

            // Wrap login result in a newly created Observable.
            return Observable.create((observer: Observer<Response>) => {

                // Attempt login.
                LoginComponent.display(this.dialogService).subscribe(() => {

                    // If login successful, then re-send original request and go through this process recursively.
                    if (this.sessionDataService.sessionDataAvailable()) {
                        retrySendRequestCallback().subscribe((response: Response) => {
                            observer.next(response);
                            observer.complete();
                        });
                    }
                    // Else login not successful so simply return original response with error information.
                    else {
                        observer.next(response);
                        observer.complete();
                    }
                });
            })
        }

        // No problems with signup confirmation or login detected!
        return Observable.of(response);
    }
}
