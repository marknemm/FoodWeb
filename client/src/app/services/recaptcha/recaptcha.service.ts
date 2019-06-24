import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../../environments/environment';

/**
 * Http Headers used for a request that shouldn't have client-side RECAPTCHA processing done on it.
 */
export const NO_RECAPTCHA_HEADERS = new HttpHeaders({ 'no-recaptcha': 'true' });

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService implements HttpInterceptor {

  constructor(
    private _recaptchaV3Service: ReCaptchaV3Service
  ) {}

  /**
   * Examines outgoing Http Requests in order to ascertain whether or not to capture RECAPTCHA scroe data.
   * Should only gather updated RECAPTCHA score data to send to the server if the request supports a JSON body.
   * If the custom no-recaptcha header is set on the outgoing request, then RECAPTCHA score generation is skipped on the client.
   * @param req The outgoing Http Request.
   * @param next The next handler for outgoing requests.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const noRecaptcha: boolean = (!environment.recaptchaSiteKey || req.headers.get('no-recaptcha') != null);
    if (!noRecaptcha && req.method !== 'GET') {
      return this._recaptchaV3Service.execute(req.url).pipe(
        catchError((err: Error) => {
          console.error(err);
          return next.handle(req);
        }),
        flatMap((recaptchaScore: string) => {
          (!req.body)
            ? req = req.clone({ body: { recaptchaScore } })
            : req.body.recaptchaScore = recaptchaScore;
          return next.handle(req);
        })
      );
    }
    return next.handle(req);
  }
}
