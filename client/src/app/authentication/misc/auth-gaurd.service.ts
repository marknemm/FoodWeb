import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from '../login/login.component'

@Injectable()
export class AuthGaurdService implements CanActivate {

  constructor(
    private http: Http,
    private router: Router,
    private dialogService: DialogService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
    // If we aren't even marked as logged in locally, then we don't even need to ask server if we are logged in.
    if (sessionStorage.getItem('appUserKey') == null) {
      this.attemptLoginAndRedirect(state.url);
      return false;
    }

    // We are marked as logged in locally, but check with server to ensure we are still authenticated!
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var observer : Observable<Response> = this.http.get('/authentication/reAuthenticate')

    // Finally, check the response from the server and react appropriately.
    return observer.map((response: Response) => {
      var body = response.json();
      // If not a success, then redirect to login.
      if (!body.success) {
        this.attemptLoginAndRedirect(state.url);
      }
      return body.success;
    });
  }

  /**
   * Generates a login dialog that the user can login with. If login is successful, then the user is redirected to their original target route.
   * @param toUrl THe url that the user was trying to access before reAuthentication.
   */
  private attemptLoginAndRedirect(toUrl: string): void {
    var dialogObserver = this.dialogService.addDialog(
      LoginComponent,
      // Dialog Initalization Data
      null,
      // DialogOptions
      {
        closeByClickingOutside: true,
        backdropColor: '#222222',
      }
    );
    
    // Observe what the dialog result is.
    dialogObserver.subscribe((isConfirmed) => {
      // After done with login dialog, if we are logged in, then we can redirect to original intended link!
      if (sessionStorage.getItem('appUserKey') != null) {
        this.router.navigate([ toUrl ]);
      }
    });
  }

}
